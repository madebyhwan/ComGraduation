import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { decodeJWT } from '../api/http';
import './Main.css';
import logo from '../img/knu-logo.png';
import LecSearch from '../components/LecSearch';
import api from '../api/api';

const TABS = [
  { key: 'home', label: 'Home' },
  { key: 'my-info', label: '내 정보' },
  { key: 'my-courses', label: '나의 수강 및 활동 내역' },
  { key: 'graduation-check', label: '졸업 자가 진단' },
];

// [추가] 영어 시험 종류 상수
const ENGLISH_TEST_OPTIONS = [
  'TOEIC', 'TOEIC SPEAKING', 'PBT', 'IBT',
  'CBT', 'TEPS', 'TEPS SPEAKING', 'OPIC',
  'G-TELP', 'IELTS'
];

/**
 * [추가] 백엔드에서 받은 User 객체(DB 형식)를 프론트엔드 'info' 상태 형식으로 변환합니다.
 * @param {object} user - userController.js의 getUserProfile에서 보낸 user 객체
 */
const transformBackendToFrontend = (user) => {
  let gradReq = '';
  if (user.passedInterview) gradReq = 'interview';
  else if (user.passedTopcit) gradReq = 'topcit';

  return {
    userId: user.userId,
    username: user.username,
    userYear: user.userYear,
    userDepartment: user.userDepartment,
    userTrack: user.userTrack === '심컴' ? '없음(심컴)' : user.userTrack, // 백엔드 '심컴' -> UI '없음(심컴)'
    counsel: String(user.counselingCount || 0), // 백엔드 counselingCount(Number) -> UI counsel(String)
    englishTest: user.englishTest?.testType || '', // 백엔드 englishTest 객체 -> UI 문자열
    englishScore: user.englishTest?.score || '', // 백엔드 englishTest 객체 -> UI 문자열
    graduationRequirement: gradReq, // 백엔드 boolean 필드 -> UI 문자열
    hasStartup: user.isStartup || false, // 백엔드 isStartup -> UI hasStartup
    isExchangeStudent: user.isExchangeStudent || false,
    multiMajorType: '', // 다중전공 분류 (예: 복수전공, 연계전공 등)
  };
};

/**
 * [추가] 프론트엔드 'info' 상태를 백엔드 updateUserProfile이 요구하는 Payload 형식으로 변환합니다.
 * @param {object} infoState - 프론트엔드의 'info' state 객체
 */
const transformFrontendToBackend = (infoState) => {
  return {
    userDepartment: infoState.userDepartment,
    userTrack: infoState.userTrack === '없음(심컴)' ? '심컴' : infoState.userTrack, // UI '없음(심컴)' -> 백엔드 '심컴'
    englishTest: { // UI 문자열 -> 백엔드 englishTest 객체
      testType: infoState.englishTest === '' ? null : infoState.englishTest,
      score: infoState.englishScore || null
    },
    passedInterview: infoState.graduationRequirement === 'interview', // UI 문자열 -> 백엔드 boolean
    passedTopcit: infoState.graduationRequirement === 'topcit', // UI 문자열 -> 백엔드 boolean
    isStartup: infoState.hasStartup, // UI hasStartup -> 백엔드 isStartup
    isExchangeStudent: infoState.isExchangeStudent,
    counselingCount: parseInt(infoState.counsel) || 0 // UI counsel(String) -> 백엔드 counselingCount(Number)
    ,
    // 다중전공 분류 정보가 있을 경우 포함
    multiMajorType: infoState.multiMajorType || null
  };
};

function Main() {
  // const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  // [추가] 정보 저장 시 로딩 상태
  const [isSaving, setIsSaving] = useState(false);

  // [수정] info 상태에 새로운 필드들 추가
  const [info, setInfo] = useState(() => ({
    userId: '',
    username: '',
    userYear: '',
    userDepartment: '',
    userTrack: '',
    counsel: '0',
    // 1. 영어 성적
    englishTest: '', // 시험 종류
    englishScore: '', // 시험 점수
    // 2. 졸업 요건 (인터뷰 or TOPCIT)
    graduationRequirement: '', // 'interview' or 'topcit'
    // 3. 창업 유무
    hasStartup: false,
    // 4. 다중전공 분류
    multiMajorType: '',
    // 5. 교환학생 여부
    isExchangeStudent: false,
  }));



  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      //navigate('/');
      window.location.href = '/';
      return;
    }
    let payload = decodeJWT(token);
    setAuthUser(payload);

    loadUserProfile(); // [수정] DB에서 최신 프로필 정보를 불러옵니다.
    loadMyCourses();


  }, []); //[수정] payload에 담긴 사용자 정보 전체를 info 상태에 설정

  // [추가] DB에서 상세 프로필 정보를 불러오는 함수
  const loadUserProfile = async () => {
    try {
      const response = await api.get('/api/users/profile'); // [API CALL]
      setInfo(transformBackendToFrontend(response.data.user)); // 변환 함수를 통해 state 설정
    } catch (error) {
      console.error('사용자 프로필 로딩 실패:', error);
      alert('사용자 정보를 불러오는 데 실패했습니다.');
    }
  };

  const loadMyCourses = async () => {
    try {
      const response = await api.get('/api/users/getLecture');
      setMyCourses(response.data.data || []);
    } catch (error) {
      console.error("수강 내역을 불러오는 중 오류 발생:", error);
      alert('수강 내역을 불러오는 데 실패했습니다.');
    }
  };


  // [수정] 모달에서 강의를 추가하는 함수
  const handleAddLecture = async (lecture) => {
    if (myCourses.some(course => course._id === lecture._id)) {
      return alert('이미 추가된 강의입니다.');
    }
    try {
      const response = await api.post('/api/users/addUnivLect', { lectureId: lecture._id });
      setMyCourses(prevCourses => [...prevCourses, response.data.lectInfo]);
      alert(`'${lecture.lectName}' 강의가 추가되었습니다.`);

      //setIsSearchModalOpen(false); // 성공 시 모달 창을 닫습니다.
    } catch (error) {
      console.error('강의 추가 중 오류 발생:', error);
      alert(error.response?.data?.message || '강의 추가에 실패했습니다.');
    }
  };

  // [수정] 개별 체크박스의 상태를 관리하는 함수입니다.
  const handleSelectCourse = (lectureId) => {
    setSelectedCourses(prevSelected => {
      // 불변성을 유지하기 위해 이전 Set을 복사하여 새로운 Set을 만듭니다.
      const newSelected = new Set(prevSelected);
      if (newSelected.has(lectureId)) {
        newSelected.delete(lectureId); // 이미 있으면 제거 (체크 해제)
      } else {
        newSelected.add(lectureId); // 없으면 추가 (체크)
      }
      return newSelected;
    });
  };

  // [수정] 전체 선택 체크박스의 상태를 관리하는 함수입니다.
  const handleSelectAllCourses = (e) => {
    if (e.target.checked) {
      // "전체 선택"이 체크되면, 현재 모든 강의의 ID를 Set에 담아 상태를 업데이트합니다.
      const allCourseIds = new Set(myCourses.map(course => course._id));
      setSelectedCourses(allCourseIds);
    } else {
      // "전체 선택"이 해제되면, Set을 비워서 모든 선택을 해제합니다.
      setSelectedCourses(new Set());
    }
  };

  // [추가] 선택된 강의들을 삭제하는 함수
  const handleDeleteLectures = async () => {
    if (selectedCourses.size === 0) {
      return alert('삭제할 강의를 선택해주세요.');
    }

    if (!window.confirm(`선택된 ${selectedCourses.size}개의 강의를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // 1. 선택된 모든 강의 ID에 대해 병렬로 삭제 API를 호출합니다.
      const deletePromises = Array.from(selectedCourses).map(lectureId =>
        // URL 파라미터로 lectureId를 전달하여 DELETE 요청을 보냅니다.
        api.delete(`/api/users/deleteLecture/${lectureId}`)
      );

      const responses = await Promise.all(deletePromises);
      const deletedIds = new Set(responses.map(res => res.data.deletedLectureId));

      setMyCourses(prevCourses =>
        prevCourses.filter(course => !deletedIds.has(course._id))
      );

      setSelectedCourses(new Set()); // 선택 상태를 초기화
      alert('선택한 강의가 성공적으로 삭제되었습니다.');

    } catch (error) {
      console.error('강의 삭제 실패:', error);
      alert(error.response?.data?.message || '강의 삭제에 실패했습니다.');
    }
  };

  // [추가] info 상태를 업데이트하는 범용 핸들러
  const updateInfo = (key, value) => {
    setInfo(prev => ({ ...prev, [key]: value }));
    // If user changes the department, keep existing behavior for track handling
    if (key === 'userDepartment') {
      if (value === '심화컴퓨터공학전공') {
        // '심화' 선택 시, 트랙을 '없음(심컴)'으로 강제 설정
        setInfo(prev => ({ ...prev, userTrack: '없음(심컴)' }));
      } else if (value === '글로벌SW융합전공') {
        // 만약 원본 트랙이 '심컴'이면 (즉, 원래 '심화' 유저였다면) '글로벌'로 바꿀 때 트랙을 초기화
        setInfo(prev => ({
          ...prev,
          userTrack: authUser.userTrack === '심컴' ? '' : (authUser?.userTrack || '')
        }));
      }
    }

    // If user changes the track away from '다중전공', clear multiMajorType
    if (key === 'userTrack' && value !== '다중전공') {
      setInfo(prev => ({ ...prev, multiMajorType: '' }));
    }
  };



  const saveInfo = async () => {
    setIsSaving(true); // 로딩 시작

    // 1. 프론트엔드 상태를 백엔드 페이로드로 변환
    const payload = transformFrontendToBackend(info);

    try {
      // 2. 백엔드 API 호출 (userController.js의 updateUserProfile)
      // 2. [수정] api.put -> api.patch로 변경 (userRoutes.js에 맞춰)
      const response = await api.patch('/api/users/profile', payload);

      // 3. 서버로부터 받은 최신 유저 정보로 프론트엔드 상태 다시 업데이트
      const updatedInfo = transformBackendToFrontend(response.data.user);
      setInfo(updatedInfo);

      // 4. authUser(토큰) 정보도 업데이트 (전공/트랙 변경 시 중요)
      //    (선택사항: 더 정확하게 하려면 새 토큰을 발급받아 authUser와 localStorage를 모두 갱신해야 함)
      const { user } = response.data;
      setAuthUser(prev => ({
        ...prev,
        userDepartment: user.userDepartment,
        userTrack: user.userTrack,
      }));

      alert('정보가 성공적으로 저장되었습니다!');

    } catch (error) {
      console.error('내 정보 저장 실패:', error);
      alert(error.response?.data?.message || '정보 저장에 실패했습니다.');
    } finally {
      setIsSaving(false); // 로딩 종료
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    // navigate('/');
    window.location.href = '/'; // navigate 대신 사용
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-left"><img src={logo} alt="KNU Logo" /></div>
        <div className="header-center">
          <h1>Comgraduation!</h1>
          <p>경북대학교 컴퓨터학부 졸업 자가 진단 시스템</p>
        </div>
        <div className="header-right">
          <p><strong>{authUser?.username || ''}</strong> 님! 반갑습니다</p>
          <button className="logout-btn" onClick={logout}>로그아웃</button>
        </div>
      </header>
      <main className="main-content">
        <nav className="sidebar">
          {TABS.map(t => (
            <button key={t.key} className={`nav-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>{t.label}</button>
          ))}
        </nav>
        <section className="content-display">
          {activeTab === 'home' && (
            <div className="content-box"><h2>공지사항</h2><p>Comgraduation 시스템에 오신 것을 환영합니다.</p></div>
          )}
          {activeTab === 'my-info' && (
            <div className="content-box">
              <h2>내 정보</h2>
              <div className="info-form">
                <div className="info-row"><label>아이디</label><input value={info.userId} readOnly onChange={e => updateInfo('userId', e.target.value)} /></div>
                <div className="info-row"><label>이름</label><input value={info.username} onChange={e => updateInfo('username', e.target.value)} /></div>
                <div className="info-row"><label>전공</label>
                  <div className="tag-group" id="department-tags">
                    {['글로벌SW융합전공', '심화컴퓨터공학전공'].map(dep => (
                      <button type="button" key={dep} className={`tag-btn ${info.userDepartment === dep ? 'selected' : ''}`}
                        onClick={() => updateInfo('userDepartment', dep)}>{dep}</button>
                    ))}
                  </div>
                </div>
                <div className="info-row"><label>졸업 트랙</label>
                  <div className="tag-group" id="track-tags">
                    {/* [수정] UI에 표시할 트랙 옵션들. 백엔드 '심컴'은 UI '없음(심컴)'으로 표시 */}
                    {['없음(심컴)', '다중전공', '해외복수학위', '학석사연계'].map(tr => {

                      // [수정] 현재 전공이 '심화'일 경우, '없음(심컴)'이 아니면 버튼을 숨김
                      if (info.userDepartment === '심화컴퓨터공학전공' && tr !== '없음(심컴)') {
                        return null;
                      }
                      // [수정] 현재 전공이 '글로벌'일 경우, '없음(심컴)' 버튼을 숨김
                      if (info.userDepartment === '글로벌SW융합전공' && tr === '없음(심컴)') {
                        return null;
                      }

                      return (
                        <button
                          type="button"
                          key={tr}
                          // [수정] info.userTrack이 '없음(심컴)'/'다중전공' 등과 일치하는지 확인
                          className={`tag-btn ${info.userTrack === tr ? 'selected' : ''}`}
                          // [수정] '심화'일 경우 모든 트랙 버튼 비활성화
                          disabled={info.userDepartment === '심화컴퓨터공학전공'}
                          onClick={() => updateInfo('userTrack', tr)}
                        >
                          {tr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* [변경] '다중전공' 선택 시에만 나타나는 다중전공 분류 버튼 */}
                {info.userTrack === '다중전공' && (
                  <div className="info-row">
                    <label>다중전공 분류</label>
                    <div className="tag-group">
                      {['복수전공', '연계전공', '융합전공', '부전공'].map(type => (
                        <button
                          key={type}
                          type="button"
                          className={`tag-btn ${info.multiMajorType === type ? 'selected' : ''}`}
                          onClick={() => updateInfo('multiMajorType', type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* [추가] 영어 성적 입력란 */}
                <div className="info-row">
                  <label>영어 성적</label>
                  <div className="english-score-inputs">
                    <select
                      value={info.englishTest}
                      onChange={(e) => updateInfo('englishTest', e.target.value)}>

                      <option value="">선택</option>
                      {ENGLISH_TEST_OPTIONS.map(test => <option key={test} value={test}>{test}</option>)}
                    </select>
                    <input
                      type="text"
                      value={info.englishScore}
                      onChange={(e) => updateInfo('englishScore', e.target.value)}
                      placeholder="점수 입력"
                    />
                  </div>
                </div>

                {/* [추가] 졸업요건(인터뷰/TOPCIT) 선택 */}
                <div className="info-row">
                  <label>졸업요건</label>
                  <div className="tag-group">
                    <button type="button" className={`tag-btn ${info.graduationRequirement === 'interview' ? 'selected' : ''}`} onClick={() => updateInfo('graduationRequirement', 'interview')}>졸업 인터뷰</button>
                    <button type="button" className={`tag-btn ${info.graduationRequirement === 'topcit' ? 'selected' : ''}`} onClick={() => updateInfo('graduationRequirement', 'topcit')}>TOPCIT</button>
                  </div>
                </div>

                {/* [추가] 창업 유무, 교환학생 여부 체크박스 */}
                <div className="info-row checkbox-group">
                  <label>기타</label>
                  <div className="checkbox-item">
                    <input type="checkbox" id="startup-check" checked={info.hasStartup} onChange={e => updateInfo('hasStartup', e.target.checked)} />
                    <label htmlFor="startup-check">창업 여부</label>
                    <input type="checkbox" id="exchange-check" checked={info.isExchangeStudent} onChange={e => updateInfo('isExchangeStudent', e.target.checked)} />
                    <label htmlFor="exchange-check">교환학생 여부</label>
                  </div>
                </div>

                <div className="info-row"><label>지도교수상담</label><input className="small-input" value={info.counsel} onChange={e => updateInfo('counsel', e.target.value < 0 ? '0' : e.target.value)} /></div>
              </div>
              {/* [수정] '내 정보 저장' 버튼에 로딩 상태(isSaving)를 반영합니다. */}
              <div className="form-actions">
                <button
                  id="save-info-btn"
                  className="action-btn"
                  onClick={saveInfo}
                  disabled={isSaving}
                >
                  {isSaving ? '저장 중...' : '내 정보 저장'}
                </button>
              </div>
            </div>
          )}
          {activeTab === 'my-courses' && (
            <div className="content-box">
              <div className="content-header">
                <h2>나의 수강 및 활동 내역</h2>
                <div className="form-actions">
                  <button className="action-btn" onClick={() => setIsSearchModalOpen(true)}>강의 추가</button>
                  <button className="action-btn">기타 활동 추가</button>
                  <button className="action-btn" onClick={handleDeleteLectures}>삭제</button>
                </div>
              </div>

              {myCourses.length === 0 ? (
                <div className="empty-courses-message">
                  '강의 추가'를 눌러 수강한 과목을 추가해 주세요.
                </div>
              ) : (

                <div className="table-scroll">
                  <table className="course-table">
                    <thead>
                      <tr>
                        <th>
                          {/* [수정] 전체 선택 체크박스: 모든 강의가 선택되었을 때만 checked 상태가 됩니다. */}
                          <input
                            type="checkbox"
                            onChange={handleSelectAllCourses}
                            checked={myCourses.length > 0 && selectedCourses.size === myCourses.length}
                          />
                        </th>
                        <th>개설년도</th>
                        <th>개설학기</th>
                        <th>교과목명</th>
                        <th>교과목코드</th>
                        <th>담당교수</th>
                        <th>분반</th>
                        <th>강의시간</th>
                        <th>학점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myCourses.map((course) => (
                        <tr key={course._id}>
                          <td>
                            {/* [수정] 개별 체크박스: selectedCourses Set에 현재 강의의 ID가 포함되어 있을 때만 checked 상태가 됩니다. */}
                            <input
                              type="checkbox"
                              checked={selectedCourses.has(course._id)}
                              onChange={() => handleSelectCourse(course._id)}
                            />
                          </td>
                          <td>{course.lectYear}</td>
                          <td>{course.lectSemester}</td>
                          <td>{course.lectName}</td>
                          <td>{course.lectCode}</td>
                          <td>{course.lectProfessor}</td>
                          <td>{course.lectDiv}</td>
                          <td>{course.lectTime}</td>
                          <td>{course.lectCredit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === 'graduation-check' && (
            <div className="content-box">
              <div className="content-header"><h2>나의 졸업 요건 충족 현황</h2><button className="action-btn-green">진단하기</button></div>
              <ul className="status-list">
                <li><span>총 이수학점</span><div className="status-value"><span className="credit-box">**</span> / 130</div></li>
                <li><span>전공 학점</span><div className="status-value"><span className="credit-box">30</span> / 54</div></li>
                <li><span>교양 학점</span><div className="status-value"><span className="credit-box">36</span> / 24 ~ 42</div></li>
              </ul>
            </div>
          )}
        </section>
      </main>

      {isSearchModalOpen && (
        <LecSearch
          onClose={() => setIsSearchModalOpen(false)}
          onAddLecture={handleAddLecture}
        />
      )}

    </div>
  );
}

export default Main;