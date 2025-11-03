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
  { key: 'my-courses', label: '나의 수강 내역' },
  { key: 'graduation-check', label: '졸업 자가 진단' },
];

// [추가] 영어 시험 종류 상수
const ENGLISH_TEST_OPTIONS = [
  '선택', '토익(TOEIC)', '토익(TOEIC)스피킹', '토플(PBT)', '토플(IBT)', 
  '토플(CBT)', '텝스(TEPS)', '개정텝스(TEPS)', '텝스(TEPS)스피킹', 'OPIc', 
  'G-Telp', 'IELTS'
];

function Main() {
  // const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); 
  const [myCourses, setMyCourses] = useState([]);
    // [추가] 삭제할 강의 ID를 관리하기 위한 state
  const [selectedCourses, setSelectedCourses] = useState(new Set());

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
    // 4. 다중전공 학과
    secondMajor: '',
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

    // [추가] 백엔드의 '심컴' 트랙을 UI의 '없음(심컴)'으로 변환합니다.
    const uiPayload = {
      ...payload,
      userTrack: payload.userTrack === '심컴' ? '없음(심컴)' : payload.userTrack
    };

    setInfo(prev => ({
      ...prev, ...payload, }));      
   
    loadMyCourses();


  }, []); //[수정] payload에 담긴 사용자 정보 전체를 info 상태에 설정

     // [추가] 서버에서 수강 내역을 불러오는 비동기 함수
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
    if (key === 'userDepartment') {
      if (value === '심화컴퓨터공학전공') {
        // '심화' 선택 시, 트랙을 '없음(심컴)'으로 강제 설정
        setInfo(prev => ({ ...prev, userTrack: '없음(심컴)' }));
      } else if (value === '글로벌SW융합전공') {
        // '글로벌' 선택 시, 토큰에 저장된 원래 트랙 값으로 복원
        // authUser는 원본 '심컴'/'다중전공' 등을 가지고 있음
        const originalTrack = authUser.userTrack === '심컴' 
          ? '없음(심컴)' // 원본이 '심컴'이어도 UI는 '없음(심컴)' (이 경우는 없어야 함)
          : authUser.userTrack; // '다중전공' 등
        
        // 만약 원본 트랙이 '심컴'이면 (즉, 원래 '심화' 유저였다면) '글로벌'로 바꿀 때 트랙을 초기화
        setInfo(prev => ({ 
          ...prev, 
          userTrack: authUser.userTrack === '심컴' ? '' : authUser.userTrack
        }));
      }
    }
   };

    
  
  const saveInfo = () => { 
    const payload = {
      ...info,
      userTrack: info.userTrack === '없음(심컴)' ? '심컴' : info.userTrack
      };
    console.log('저장된 정보:', info); alert('정보가 성공적으로 저장되었습니다! (서버 저장 API 미구현)');
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
            <button key={t.key} className={`nav-btn ${activeTab===t.key?'active':''}`} onClick={() => setActiveTab(t.key)}>{t.label}</button>
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
                    {['글로벌SW융합전공','심화컴퓨터공학전공'].map(dep => (
                      <button type="button" key={dep} className={`tag-btn ${info.userDepartment===dep?'selected':''}`} 
                      onClick={() => updateInfo('userDepartment', dep)}>{dep}</button>
                    ))}
                  </div>
                </div>
                <div className="info-row"><label>졸업 트랙</label>
                  <div className="tag-group" id="track-tags">
                    {/* [수정] UI에 표시할 트랙 옵션들. 백엔드 '심컴'은 UI '없음(심컴)'으로 표시 */}
                    {['없음(심컴)','다중전공','해외복수학위','학석사연계'].map(tr => {
                      
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
                
                {/* [추가] '다중전공' 선택 시에만 나타나는 학과 입력란 */}
                {info.userTrack === '다중전공' && (
                  <div className="info-row">
                    <label>다중전공 학과</label>
                    <input 
                      type="text"
                      value={info.secondMajor}
                      onChange={(e) => updateInfo('secondMajor', e.target.value)}
                      placeholder="예: 전자공학부"
                    />
                  </div>
                )}

                {/* [추가] 영어 성적 입력란 */}
                <div className="info-row">
                  <label>영어 성적</label>
                  <div className="english-score-inputs">
                    <select value={info.englishTest} onChange={(e) => updateInfo('englishTest', e.target.value)}>
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
                    <button type="button" className={`tag-btn ${info.graduationRequirement==='interview'?'selected':''}`} onClick={() => updateInfo('graduationRequirement', 'interview')}>졸업 인터뷰</button>
                    <button type="button" className={`tag-btn ${info.graduationRequirement==='topcit'?'selected':''}`} onClick={() => updateInfo('graduationRequirement', 'topcit')}>TOPCIT</button>
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

                <div className="info-row"><label>지도교수상담</label><input value={info.counsel} onChange={e => updateInfo('counsel', e.target.value)} /></div>
              </div>
              <div className="form-actions"><button id="save-info-btn" className="action-btn" onClick={saveInfo}>내 정보 저장</button></div>
            </div>
          )}
          {activeTab === 'my-courses' && (            
            <div className="content-box">
              <div className="content-header">
                <h2>나의 수강 내역</h2>
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