import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, findIdByName } from '../api/api.js'; // 4단계에서 수정한 api.js
import { Monitor } from 'lucide-react';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- [추가] 아이디 찾기 관련 State ---
  const [showFindModal, setShowFindModal] = useState(false); // 모달 표시 여부
  const [findName, setFindName] = useState(''); // 찾을 이름 입력
  const [findResult, setFindResult] = useState(''); // 찾은 결과 메시지
  const [findError, setFindError] = useState(''); // 찾기 에러 메시지

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login({ studentId, password });
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        navigate('/app');
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error("로그인 에러:", err); // 콘솔에서 정확한 에러 확인용

      // [수정] 에러 응답(response)이 있고, 상태 코드가 400, 401, 404 등인 경우
      if (err.response && (err.response.status === 400 || err.response.status === 401 || err.response.status === 404)) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        // 서버가 꺼져있거나 네트워크 문제인 경우
        setError('로그인 중 오류가 발생했습니다. (서버 연결 실패)');
      }
    }
  };

  // [추가] 아이디 찾기 핸들러
  const handleFindId = async (e) => {
    e.preventDefault();
    setFindResult('');
    setFindError('');

    if (!findName.trim()) {
      setFindError('이름을 입력해주세요.');
      return;
    }

    try {
      // API 호출: 이름으로 아이디 요청
      const response = await findIdByName(findName);
      
      // 백엔드 응답 구조에 따라 수정 필요 (예: response.data.userId)
      // 여기서는 response.data에 아이디가 바로 온다고 가정하거나
      // response가 { success: true, userId: '...' } 형태라고 가정
      const foundId = response.data?.userId || response.data || response; 
      
      if (foundId) {
        setFindResult(`회원님의 아이디는 "${foundId}" 입니다.`);
        setStudentId(foundId);
      } else {
        setFindError('해당 이름으로 가입된 아이디가 없습니다.');
      }
    } catch (err) {
      console.error("아이디 찾기 에러:", err);
      if (err.response && err.response.status === 404) {
        setFindError('해당 이름의 사용자를 찾을 수 없습니다.');
      } else {
        setFindError('아이디 찾기 중 오류가 발생했습니다.');
      }
    }
  };

  // [추가] 모달 닫기 핸들러
  const closeFindModal = () => {
    setShowFindModal(false);
    setFindName('');
    setFindResult('');
    setFindError('');
  };

  return (
    // Tailwind 스타일 적용
    <div className="auth-layout">
      <div className="auth-card">
        <h1 className="auth-title">
          ComGraduation
        </h1>

        {/* [추가] PC 환경 권장 알림 박스 */}
        <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800">
            <Monitor size={20} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium break-keep text-center">
              원활한 서비스 이용을 위해 <br className="block sm:hidden"/> <br></br><b>PC 환경 접속</b>을 권장합니다.
            </span>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="studentId">
              ID
            </label>
            <input
              className="form-input"
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              비밀번호
            </label>
            <input
              className="form-input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button className="w-full justify-center rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80" type="submit">
            로그인
          </button>
        </form>

        <div className="flex justify-between text-sm text-gray-600 mt-4">
           {/* [추가] 아이디 찾기 버튼 */}
           <button 
            type="button"
            onClick={() => setShowFindModal(true)}
            className="hover:text-knu-blue underline"
           >
             아이디 찾기
           </button>
          <p>
            계정이 없으신가요? <Link to="/signup" className="font-medium text-knu-blue hover:underline"> 회원가입 </Link>
          </p>
        </div>
      </div>

      {/* [추가] 아이디 찾기 모달 (팝업) */}
      {showFindModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">아이디 찾기</h2>
            
            {!findResult ? (
              <form onSubmit={handleFindId} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    가입시 등록한 이름
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-knu-blue"
                    placeholder="이름을 입력하세요"
                    value={findName}
                    onChange={(e) => setFindName(e.target.value)}
                  />
                </div>
                
                {findError && (
                  <p className="text-sm text-red-600">{findError}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeFindModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-knu-blue rounded-md hover:bg-opacity-90"
                  >
                    찾기
                  </button>
                </div>
              </form>
            ) : (
              /* 결과 화면 */
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-50 text-blue-800 rounded-md font-medium">
                  {findResult}
                </div>
                <button
                  onClick={() => {
                    // 찾은 아이디를 로그인 폼에 자동 입력해주기 (선택사항)
                    // setStudentId(찾은아이디); 
                    closeFindModal();
                  }}
                  className="w-full px-4 py-2 text-white bg-knu-blue rounded-md hover:bg-opacity-90"
                >
                  로그인 하러 가기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;