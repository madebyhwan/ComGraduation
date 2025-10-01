import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import character from '../img/character.png';
import { apiRequest } from '../api/http';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', // -> backend: username (사용자 표시 이름)
    userId: '',   // -> backend: userId (로그인 ID)
    userPassword: '',
    passwordConfirm: '',
    userYear: '',
    userDepartment: '',
    userTrack: ''
  });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const [idCheck, setIdCheck] = useState({ message: '', status: '' });

  const selectSingle = (k, value) => update(k, value === form[k] ? '' : value);

  // [추가] 아이디 중복 확인 버튼 클릭 시 실행될 함수
  const onCheckId = () => {
    // UI 테스트를 위한 시뮬레이션 (실제로는 여기서 API 호출)
    if (!form.userId) {
      return alert('아이디를 입력해주세요.');
    }
    // 'admin', 'user'는 이미 사용 중인 아이디로 가정
    if (['admin', 'user'].includes(form.userId)) {
      setIdCheck({
        message: '이미 사용 중인 아이디입니다.',
        status: 'unavailable' // CSS 클래스명
      });
    } else {
      setIdCheck({
        message: '사용 가능한 아이디입니다.',
        status: 'available' // CSS 클래스명
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.userPassword !== form.passwordConfirm) return alert('비밀번호가 일치하지 않습니다.');
    if (!form.userDepartment) return alert('전공을 선택해주세요.');
    if (!form.userTrack) return alert('졸업트랙을 선택해주세요.');
    setLoading(true);
    try {
      const payload = {
        userId: form.userId,
        userPassword: form.userPassword,
        userYear: form.userYear,
        username: form.username,
        userDepartment: form.userDepartment,
        userTrack: form.userTrack
      };
      await apiRequest('/api/users/register', { method: 'POST', body: payload });
      alert(`${form.username}님, 회원가입이 완료되었습니다!`);
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 백엔드 enum과 매핑 필요
  // userYear enum: ['21학번'] -> UI는 선택 제한
  // userDepartment enum: ['글로벌SW융합전공', '심화컴퓨터공학전공']
  // userTrack enum: ['심컴', '다중전공', '해외복수학위', '학석사연계']
  const yearOptions = ['21학번'];
  const departmentOptions = ['글로벌SW융합전공', '심화컴퓨터공학전공'];
  const trackOptions = ['없음(심컴)', '다중전공', '해외복수학위', '학석사연계'];

  return (
    <div className="signup-container">
      <div className="character-section">
        <div className="speech-bubble">
          <p>정보는 회원가입 후에도<br/>수정이 가능합니다!</p>
        </div>
        <img src={character} alt="Mascot" className="character-image" />
      </div>
      <div className="form-section">
        <h1 className="form-title">Comgraduation</h1>
        <form id="signupForm" onSubmit={onSubmit}>
          <div className="input-group">
            <label htmlFor="username">이름</label>
            <input id="username" value={form.username} onChange={e => update('username', e.target.value)} required />
          </div>
          
      <div className="input-group">
            <div className="label-group">
              <label htmlFor="userId">아이디</label>
              <span className={`check-result-msg ${idCheck.status}`}>
                {idCheck.message}
              </span>
            </div>
            <div className="input-with-button">
              <input id="userId" value={form.userId} onChange={e => update('userId', e.target.value)} required />
              <button type="button" onClick={onCheckId} id="check-username-btn">중복확인</button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input id="password" type="password" value={form.userPassword} onChange={e => update('userPassword', e.target.value)} required />
          </div>
            <div className="input-group">
            <label htmlFor="passwordConfirm">비밀번호 재확인</label>
            <input id="passwordConfirm" type="password" value={form.passwordConfirm} onChange={e => update('passwordConfirm', e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="studentYear">학번</label>
            <select id="studentYear" className="styled-select" value={form.userYear} onChange={e => update('userYear', e.target.value)} required>
              <option value="" disabled> 학번을 선택하세요</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="button-select-group">
            <label>전공 (Department)</label>
            <div className="options-box" id="departmentOptions">
              {departmentOptions.map(dep => (
                <button type="button" key={dep} className={`option-btn ${form.userDepartment===dep?'selected':''}`} onClick={() => selectSingle('userDepartment', dep)}>{dep}</button>
              ))}
            </div>
          </div>
          <div className="button-select-group">
            <label>졸업트랙</label>
            <div className="options-box" id="trackOptions">
              {trackOptions.map(t => (
                <button type="button" key={t} className={`option-btn ${form.userTrack===t?'selected':''}`} onClick={() => selectSingle('userTrack', t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? '처리 중...' : '회원가입'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
