import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import character from '../img/character.png';
import api from '../api/api'

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
   const [idCheck, setIdCheck] = useState({ message: '', status: '' });
   // [추가] 아이디 중복확인 버튼 로딩 상태
  const [idCheckLoading, setIdCheckLoading] = useState(false);

  const update = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));

    if (k === 'userId') {
      setIdCheck({ message: '', status: '' });
    }
    // [추가] 전공(Department) 변경 시 트랙(Track) 로직 처리
    if (k === 'userDepartment') {
      if (v === '심화컴퓨터공학전공') {
        // '심화' 선택 시 트랙을 '없음(심컴)'으로 자동 설정
        setForm(prev => ({ ...prev, userTrack: '없음(심컴)' }));
      } else if (v === '글로벌SW융합전공') {
        // '글로벌' 선택 시 트랙을 초기화 (다시 선택해야 함)
        setForm(prev => ({ ...prev, userTrack: '' }));
      }
    }
  }; 

  const selectSingle = (k, value) => update(k, value === form[k] ? '' : value);

  // [수정] 아이디 중복 확인 함수 (API 호출 수정)
  const onCheckId = async () => {
    if (!form.userId) {
      return alert('아이디를 입력해주세요.');
    }
    setIdCheckLoading(true); // 로딩 시작
    setIdCheck({ message: '', status: '' });
    try {
      // apiRequest 사용
        await api.get('/api/users/checkId', {
          params: {
          userId: form.userId
        }
      });

        setIdCheck({ message: '사용 가능한 아이디입니다.', status: 'available' });
    } catch (err) {
        setIdCheck({ message: '이미 사용 중이거나 사용할 수 없는 아이디입니다.', status: 'unavailable' });
    } finally {
      setIdCheckLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (idCheck.status !== 'available') {
      return alert('아이디 중복 확인을 해주세요.');
    }
    if (form.userPassword !== form.passwordConfirm) return alert('비밀번호가 일치하지 않습니다.');
    if (!form.userDepartment) return alert('전공을 선택해주세요.');
        // [수정] '글로벌SW융합전공'일 때만 트랙 선택 여부를 검증합니다.
    if (form.userDepartment === '글로벌SW융합전공' && !form.userTrack) {
      return alert('졸업트랙을 선택해주세요.');
    }

    setLoading(true);
    try {
      const payload = {
        userId: form.userId,
        userPassword: form.userPassword,
        userYear: form.userYear,
        username: form.username,
        userDepartment: form.userDepartment,
        userTrack: form.userTrack === '없음(심컴)' ? '심컴' : form.userTrack
      };
      await api.post('/api/users/register', payload);
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
  const trackOptions = ['다중전공', '해외복수학위', '학석사연계'];

  const isSubmitDisabled = loading || idCheck.status !== 'available';

  return (
    <div className="signup-container">
      <div className="character-section">
        <div className="speech-bubble">
          <p>아이디 외의 정보는 <br/>회원가입 후에도<br/>수정이 가능합니다!</p>
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
              {/* [수정] 로딩 상태에 따라 버튼 비활성화 및 텍스트 변경 */}
              <button
                type="button"
                onClick={onCheckId}
                id="check-username-btn"
                disabled={idCheckLoading}
              >
                {idCheckLoading ? '확인 중...' : '중복확인'}
              </button>
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
          {/* [수정] '글로벌SW융합전공'을 선택했을 때만 졸업트랙 섹션이 나타납니다. */}
          {form.userDepartment === '글로벌SW융합전공' && (
            <div className="button-select-group">
              <label>졸업트랙</label>
              <div className="options-box" id="trackOptions">
                {trackOptions.map(t => (
                  <button type="button" key={t} className={`option-btn ${form.userTrack===t?'selected':''}`} onClick={() => selectSingle('userTrack', t)}>{t}</button>
                ))}
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitDisabled}>{loading ? '처리 중...' : '회원가입'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
