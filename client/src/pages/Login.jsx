import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../img/knu-logo.png';
import { apiRequest, decodeJWT } from '../api/http';

function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!userId) return alert('아이디를 입력해주세요.');
    if (!userPassword) return alert('비밀번호를 입력해주세요.');
    setLoading(true);
    apiRequest('/api/users/login', { method: 'POST', body: { userId, userPassword } })
      .then(res => {
        if (!res.token) throw new Error('토큰이 없습니다.');
        const payload = decodeJWT(res.token);
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('authUser', JSON.stringify({
          userId: payload?.userId,
          username: payload?.username,
          token: res.token
        }));
        navigate('/app');
      })
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  };

  const goSignup = () => navigate('/signup');

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo-box">
          <img src={logo} alt="KNU Logo" />
        </div>
        <div className="welcome-message-box">
          <strong>Comgraduation</strong>에 오신 것을 환영합니다.
        </div>
      </header>
      <main className="login-main">
        <h1 className="login-title">Login</h1>
        <div className="login-form-box">
          <form onSubmit={onSubmit}>
            <div className="input-group">
              <label htmlFor="login-userId">아이디</label>
              <input id="login-userId" value={userId} onChange={e => setUserId(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="login-password">비밀번호</label>
              <input id="login-password" type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} />
            </div>
            <div className="button-group">
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </button>
              <button type="button" className="btn-signup" onClick={goSignup}>회원가입</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
