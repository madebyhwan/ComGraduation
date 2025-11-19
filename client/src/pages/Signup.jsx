import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, checkIdDuplication } from '../api/api.js';

const Signup = () => {
  // users.js 모델과 userController/registerUser를 기반으로
  const [username, setUsername] = useState('');
  const [userYear, setUserYear] = useState('21학번');
  const [userDepartment, setUserDepartment] = useState('');
  const [userTrack, setUserTrack] = useState('');

  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);

  const navigate = useNavigate();

  // 아이디 중복 확인 핸들러
  const handleCheckId = async () => {
    if (!studentId) {
      setIdCheckMsg('아이디를 입력하세요.');
      return;
    }
    try {
      const data = await checkIdDuplication(studentId);
      if (data.isAvailable) {
        setIdCheckMsg('사용 가능한 아이디입니다.');
        setIsIdChecked(true); // 중복 확인 완료
      } else {
        setIdCheckMsg('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      }
    } catch (error) {
      // api.js에서 409 오류를 처리해서 data.isAvailable = false로 옴
      if (error.response && error.response.data && error.response.data.isAvailable === false) {
        setIdCheckMsg('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      } else {
        setIdCheckMsg('중복 확인 중 오류');
        setIsIdChecked(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isIdChecked) {
      setError('아이디 중복 확인을 해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await signup({
        studentId,
        password,
        username,
        userYear,
        userDepartment,
        userTrack
      });

      if (response && response.user) {
        alert('회원가입에 성공했습니다. 로그인 페이지로 이동합니다.');
        navigate('/');
      } else {
        setError(response.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">이름</label>
            <input
              className="form-input"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="flex items-center gap-2">
              <label className="form-label" htmlFor="studentId">ID</label>
              <span className="text-xs text-gray-400 ml-1">(회원가입 후 변경 불가)</span>
            </div>
            <div className="flex gap-2">
              <input
                className="form-input flex-1"
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setIsIdChecked(false); // ID 변경 시 중복 확인 리셋
                  setIdCheckMsg('');
                }}
                required
              />
              <button
                type="button"
                onClick={handleCheckId}
                className="rounded-md bg-gray-600 py-2 px-3 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
              >
                중복확인
              </button>
            </div>
            {idCheckMsg && (
              <p className={`mt-1 text-sm ${isIdChecked ? 'text-green-600' : 'text-red-600'}`}>
                {idCheckMsg}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input
              className="form-input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              className="form-input"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="flex items-center gap-2">
              <label className="form-label" htmlFor="userYear">입학년도</label>
              <span className="text-xs text-gray-400 ml-1">(회원가입 후 변경 불가)</span>
            </div>
            <select
              className="form-input"
              id="userYear"
              value={userYear}
              onChange={(e) => setUserYear(e.target.value)}
            >
              <option value="20학번">20학번</option>
              <option value="21학번">21학번</option>
              <option value="22학번">22학번</option>
              {/* (필요시 다른 학번 추가) */}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">전공</label>
            <div className="grid grid-cols-2 gap-2">
              {['글로벌SW융합전공', '심화컴퓨터공학전공'].map((dep) => (
                <button
                  key={dep}
                  type="button"
                  onClick={() => {
                    if (userDepartment === dep) {
                      // 같은 버튼을 다시 누르면 선택 해제
                      setUserDepartment('');
                      setUserTrack('');
                    } else {
                      setUserDepartment(dep);
                      if (dep !== '심화컴퓨터공학전공') setUserTrack('');
                      else if (!userTrack) setUserTrack('다중전공');
                    }
                  }}
                  className={`w-full py-2 rounded-md border text-sm text-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${userDepartment === dep ? 'bg-knu-blue text-white border-knu-blue' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                  {dep}
                </button>
              ))}
            </div>
          </div>

          {userDepartment === '글로벌SW융합전공' && (
            <div className="form-group">
              <label className="form-label">트랙</label>
              <div className="grid grid-cols-2 gap-2">
                {['다중전공', '해외복수학위', '학석사연계'].map((track) => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setUserTrack(track)}
                    className={`w-full py-2 rounded-md border text-sm text-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${userTrack === track ? 'bg-knu-blue text-white border-knu-blue' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {track}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button className="w-full justify-center rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80" type="submit">
            회원가입
          </button>
        </form>

        <div className="auth-footer">
          <p>
            이미 계정이 있으신가요? <Link to="/">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;