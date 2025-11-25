import React, { useState, useEffect } from 'react';
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
  // [추가] 심컴 vs 플랫폼SW 이름 결정 로직
  // 23, 24, 25학번 등은 '플랫폼SW&데이터과학전공', 그 외는 '심화컴퓨터공학전공'
  const getDeepMajorName = (year) => {
      const newMajorYears = ['23학번', '24학번', '25학번'];
      return newMajorYears.includes(year) ? '플랫폼SW&데이터과학전공' : '심화컴퓨터공학전공';
  };

  // 현재 선택된 학번에 따른 심컴계열 전공명
  const currentDeepMajorName = getDeepMajorName(userYear);

  // 학번이 바뀔 때, 기존에 심컴계열을 선택했다면 새로운 이름으로 업데이트
  useEffect(() => {
      // 만약 현재 선택된 전공이 '심화컴퓨터' 혹은 '플랫폼SW' 계열이라면
      if (userDepartment === '심화컴퓨터공학전공' || userDepartment === '플랫폼SW&데이터과학전공') {
          setUserDepartment(currentDeepMajorName);
      }
  }, [userYear, currentDeepMajorName, userDepartment]);


  // 아이디 중복 확인 핸들러
  const handleCheckId = async () => {
    if (!studentId) {
      setIdCheckMsg('아이디를 입력하세요.');
      return;
    }
    // 아이디 길이 클라이언트 측 사전 검사 (선택 사항)
    if (studentId.length < 8) {
      setIdCheckMsg('아이디는 8자리 이상이어야 합니다.');
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
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        // express-validator가 보낸 첫 번째 에러 메시지를 표시
        setError(data.errors[0].msg);
      } else {
        setError(data?.message || '회원가입 중 오류가 발생했습니다.');
      }
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
                  setIsIdChecked(false)
                  setIdCheckMsg('');
                }}
                required
                placeholder="8자리 이상 입력"
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
            // placeholder="영문 대소문자, 숫자, 포함 8자 이상"
            />
            {/* [추가] 비밀번호 규칙 안내 문구 */}
            <p className="mt-1 text-xs text-gray-500">
              * 영문 대소문자, 숫자, 포함 8자 이상
            </p>
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
              <option value="23학번">23학번</option>
              <option value="24학번">24학번</option>
              <option value="25학번">25학번</option>
              {/* (필요시 다른 학번 추가) */}
            </select>
          </div>

          {/* 전공 선택 부분 수정 */}
          <div className="form-group">
            <label className="form-label">전공</label>
            <div className="grid grid-cols-1 gap-3">
              {['글로벌SW융합전공', currentDeepMajorName].map((dep) => (
                <button
                  key={dep}
                  type="button"
                  onClick={() => {
                    // 이미 선택된 것을 다시 누르면 해제
                    if (userDepartment === dep) {
                      setUserDepartment('');
                      setUserTrack('');
                    } else {
                      // 다른 전공 선택 시
                      setUserDepartment(dep);
                      if (dep === '글로벌SW융합전공') {
                        setUserTrack(''); // 글솝은 트랙 선택 필요
                      } else {
                        setUserTrack('심컴'); // 심화/플랫폼은 기본 트랙 자동 설정
                      }
                    }
                  }}
                  className={`w-full py-3 px-2 rounded-md border text-sm font-medium transition-all focus:outline-none ${
                    userDepartment === dep 
                    ? 'bg-knu-blue text-white border-knu-blue ring-2 ring-knu-blue ring-offset-1' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
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
            <p className="text-center text-sm text-red-600 mb-4 whitespace-pre-wrap">
              {/* 에러 메시지 줄바꿈 허용 */}
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