import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { decodeJWT } from '../api/http';
import './Main.css';
import logo from '../img/knu-logo.png';
import LecSearch from '../components/LecSearch';

const TABS = [
  { key: 'home', label: 'Home' },
  { key: 'my-info', label: '내 정보' },
  { key: 'my-courses', label: '나의 수강 내역' },
  { key: 'graduation-check', label: '졸업 자가 진단' },
];

function Main() {
 // const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [info, setInfo] = useState(() => ({
    userId: '',
    username: '',
    userYear: '',
    userDepartment: '',
    userTrack: '',
    counsel: '0'
  }));

  // 팝업(모달)의 열림/닫힘 상태를 관리합니다.
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  // '나의 수강 내역' 목록을 관리합니다.
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      //navigate('/');
      return;
    }
    const payload = decodeJWT(token);
    setAuthUser(payload);
    setInfo(prev => ({
      ...prev,
      userId: payload?.userId || '',
      username: payload?.username || ''
    }));

  }, []); // navigate 제거

   // 모달에서 강의를 추가하는 함수
  const handleAddLecture = (lecture) => {
    if (myCourses.some(course => course.lectCode === lecture.lectCode)) {
      return alert('이미 추가된 강의입니다.');
    }
    setMyCourses(prevCourses => [...prevCourses, lecture]);
    alert(`'${lecture.lectName}' 강의가 추가되었습니다.`);
  };


  const updateTrack = (val) => setInfo(prev => ({ ...prev, userTrack: val }));
  const updateDepartment = (val) => setInfo(prev => ({ ...prev, userDepartment: val }));
  const saveInfo = () => { console.log('저장된 정보:', info); alert('정보가 성공적으로 저장되었습니다! (서버 저장 API 미구현)'); };

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
                <div className="info-row"><label>아이디</label><input value={info.userId} readOnly /></div>
                <div className="info-row"><label>이름</label><input value={info.username} readOnly /></div>
                <div className="info-row"><label>전공</label>
                  <div className="tag-group" id="department-tags">
                    {['글로벌SW융합전공','심화컴퓨터공학전공'].map(dep => (
                      <button type="button" key={dep} className={`tag-btn ${info.userDepartment===dep?'selected':''}`} onClick={() => updateDepartment(dep)}>{dep}</button>
                    ))}
                  </div>
                </div>
                <div className="info-row"><label>졸업 트랙</label>
                  <div className="tag-group" id="track-tags">
                    {['심컴','다중전공','해외복수학위','학석사연계'].map(tr => (
                      <button type="button" key={tr} className={`tag-btn ${info.userTrack===tr?'selected':''}`} onClick={() => updateTrack(tr)}>{tr}</button>
                    ))}
                  </div>
                </div>
                <div className="info-row"><label>지도교수상담</label><input value={info.counsel} readOnly /></div>
              </div>
              <div className="form-actions"><button id="save-info-btn" className="action-btn" onClick={saveInfo}>내 정보 저장</button></div>
            </div>
          )}
          {activeTab === 'my-courses' && (
            <div className="content-box">
              {/* [수정] h2와 form-actions를 content-header로 묶습니다. */}
              <div className="content-header">
                <h2>나의 수강 내역</h2>
                <div className="form-actions">
                  <button className="action-btn" onClick={() => setIsSearchModalOpen(true)}>강의 추가</button>
                  <button className="action-btn">기타 활동 추가</button>
                  <button className="action-btn">삭제</button>
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
                        <th>선택</th>
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
                      {myCourses.map((course, i) => (
                      <tr key={course._id || i}>
                          <td><input type="checkbox" /></td>
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
