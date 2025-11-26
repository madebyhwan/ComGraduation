// client/src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyInfo, updateMyInfo, changePassword, withdrawUser } from '../api/api.js';
import { User, Award, BookMarked, Check, Lock, X } from 'lucide-react';

// [추가] 트랙 옵션을 상수로 정의
const allTrackOptions = [
    { value: '심컴', label: '심컴' },
    { value: '다중전공', label: '다중전공' },
    { value: '해외복수학위', label: '해외복수학위' },
    { value: '학석사연계', label: '학석사연계' }
];

const ProfilePage = () => {
    // [추가] MainLayout에서 전달한 updateUsername 함수 가져오기
    const { updateUsername } = useOutletContext();
    const navigate = useNavigate(); // 네비게이션 훅

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- 비밀번호 변경 모달 관련 상태 ---
    const [showPwModal, setShowPwModal] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwError, setPwError] = useState('');

    // 1. users.js 모델에 정의된 모든 상태
    const [username, setUsername] = useState('');
    const [studentId, setStudentId] = useState('');
    const [userYear, setUserYear] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userTrack, setUserTrack] = useState('');
    const [multiMajorType, setMultiMajorType] = useState(null);

    // 1-1. englishTest (객체)
    const [englishTest, setEnglishTest] = useState({ testType: null, score: '' });

    // 1-2. Boolean (체크박스)
    const [passedInterview, setPassedInterview] = useState(false);
    const [passedTopcit, setPassedTopcit] = useState(false);
    const [isStartup, setIsStartup] = useState(false);
    const [isExchangeStudent, setIsExchangeStudent] = useState(false);

    // 1-3. Number (숫자)
    const [counselingCount, setCounselingCount] = useState(0);

    const getDeepMajorName = (year) => {
        const newMajorYears = ['23학번', '24학번', '25학번'];
        return newMajorYears.includes(year) ? '플랫폼SW&데이터과학전공' : '심화컴퓨터공학전공';
    };

    // 데이터 로딩 (이전과 동일)
    useEffect(() => {

        const fetchInfo = async () => {
            try {
                const data = await getMyInfo();
                if (data && data.user) {
                    const user = data.user;
                    setStudentId(user.userId);
                    setUserYear(user.userYear);
                    setUsername(user.username);
                    setUserDepartment(user.userDepartment);
                    setUserTrack(user.userTrack);
                    setMultiMajorType(user.multiMajorType || null);
                    setEnglishTest(user.englishTest || { testType: null, score: '' });
                    setPassedInterview(user.passedInterview);
                    setPassedTopcit(user.passedTopcit);
                    setIsStartup(user.isStartup);
                    setIsExchangeStudent(user.isExchangeStudent);
                    setCounselingCount(user.counselingCount || 0);
                }
            } catch (error) {
                console.error("내 정보 로딩 실패:", error);
                setError("정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        }
        fetchInfo();
    }, []);

    // userTrack이 변경되어 '다중전공'이 아니게 되면 다중전공 유형 초기화
    useEffect(() => {
        if (userTrack !== '다중전공' && multiMajorType !== null) {
            setMultiMajorType(null);
        }
    }, [userTrack]);

    // [추가] 학번 변경 핸들러
    const handleYearChange = (e) => {
        const newYear = e.target.value;
        setUserYear(newYear);

        // 학번을 바꿨을 때, 현재 전공이 심컴 계열이라면 이름도 자동으로 맞춰준다.
        // (예: 21학번(심화) -> 23학번 선택 시 -> 전공을 '플랫폼SW'로 자동 변경)
        if (userDepartment === '심화컴퓨터공학전공' || userDepartment === '플랫폼SW&데이터과학전공') {
            const newMajorName = getDeepMajorName(newYear);
            setUserDepartment(newMajorName);
        }
    };

    // 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const profileData = {
                username,
                userYear,
                userDepartment,
                userTrack,
                multiMajorType: multiMajorType === "null" ? null : multiMajorType,
                englishTest: (englishTest.testType === "null" || !englishTest.testType)
                    ? { testType: null, score: null }
                    : englishTest,
                passedInterview,
                passedTopcit,
                isStartup,
                isExchangeStudent,
                counselingCount: Number(counselingCount || 0)
            };

            // [핵심] 서버에서 업데이트된 사용자 정보 받기
            const responseData = await updateMyInfo(profileData);
            if (responseData && responseData.user && responseData.user.username) {
                // 토큰 업데이트 (updateMyInfo API가 새 토큰 반환하면)
                if (responseData.token) {
                    localStorage.setItem('token', responseData.token);
                }
                // MainLayout의 username 상태 업데이트
                updateUsername(responseData.user.username);
                // 클라이언트에서 새로고침 시에도 반영되도록 별도 저장
                try {
                    localStorage.setItem('username', responseData.user.username);
                } catch (e) {
                    // ignore
                }
            } else {
                // 응답에 username이 없으면 현재 state로 업데이트
                updateUsername(username);
            }

            toast.success("정보가 성공적으로 저장되었습니다.", {
                position: "top-right",
                autoClose: 3000
            });
        } catch (error) {
            toast.error("정보 저장에 실패했습니다.", {
                position: "top-right",
                autoClose: 3000
            });
            setError(error.response?.data?.message || "저장 중 오류 발생");
        }
    };

    // --- (추가!) 전공 변경 시 트랙을 강제하는 핸들러 ---
    const handleDepartmentChange = (newDepartment) => {
        setUserDepartment(newDepartment);
        // [수정] '글로벌SW융합전공'이 아니면 (즉, 심컴 or 플랫폼SW) -> 트랙을 '심컴'으로 고정
        if (newDepartment !== '글로벌SW융합전공') {
            setUserTrack('심컴');
        }
        // '글로벌SW융합전공'으로 바꿨는데 기존 트랙이 '심컴'이었다면 -> 트랙 초기화 (선택 유도)
        else if (newDepartment === '글로벌SW융합전공' && userTrack === '심컴') {
            setUserTrack('');
        }
    };

    // 비밀번호 변경 핸들러
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwError('');

        if (newPw !== confirmPw) {
            setPwError('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (newPw.length < 8) {
            setPwError('비밀번호는 8자 이상이어야 합니다.');
            return;
        }
        if (!/(?=.*[a-z])/.test(newPw)) {
            setPwError('비밀번호는 최소 1개 이상의 소문자를 포함해야 합니다.');
            return;
        }
        if (!/(?=.*[A-Z])/.test(newPw)) {
            setPwError('비밀번호는 최소 1개 이상의 대문자를 포함해야 합니다.');
            return;
        }
        if (!/(?=.*\d)/.test(newPw)) {
            setPwError('비밀번호는 최소 1개 이상의 숫자를 포함해야 합니다.');
            return;
        }
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(newPw)) {
            setPwError('비밀번호는 최소 1개 이상의 특수문자(!@#$%^&*)를 포함해야 합니다.');
            return;
        }

        try {
            await changePassword({ currentPassword: currentPw, newPassword: newPw });
            toast.success('비밀번호가 변경되었습니다.', {
                position: "top-right",
                autoClose: 3000
            });
            setShowPwModal(false);
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
        } catch (err) {
            setPwError(err.response?.data?.message || '비밀번호 변경 실패');
        }
    };


    if (loading) {
        return <div className="text-center p-10">로딩 중...</div>;
    }
    const trackOptions = userDepartment === '글로벌SW융합전공'
        ? allTrackOptions.filter(option => option.value !== '심컴')
        : allTrackOptions;


    // [추가] 회원 탈퇴 핸들러
    const handleWithdraw = async () => {
        if (window.confirm("정말로 탈퇴하시겠습니까?\n탈퇴 시 수강 내역 등 모든 데이터가 삭제되며 복구할 수 없습니다.")) {
            try {
                await withdrawUser();
                alert("회원 탈퇴가 완료되었습니다.");
                localStorage.removeItem('token'); // 토큰 삭제
                navigate('/'); // 로그인 페이지로 이동
            } catch (error) {
                alert(error.response?.data?.message || "탈퇴 처리에 실패했습니다.");
            }
        }
    };

    const deepMajorName = getDeepMajorName(userYear);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-[1.6rem] md:text-3xl font-bold mb-6">내 정보</h1>

            <form className="space-y-8" onSubmit={handleSubmit}>

                {/* --- 1. 기본 정보 카드 --- */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-5 border-b border-gray-200 flex items-center gap-3">
                        <User className="w-5 h-5 text-knu-blue" />
                        <h3 className="text-xl font-semibold">기본 정보</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* (수정!) 3칸 그리드로 변경 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="username">이름</label>
                                <input className="form-input" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            {/* [수정] ID 오른쪽에 비밀번호 변경 버튼 추가 */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="studentId">ID</label>
                                <div className="flex gap-2">
                                    <input className="form-input flex-1 bg-gray-50 text-gray-500" id="studentId" type="text" value={studentId} disabled />
                                    <button
                                        type="button"
                                        onClick={() => setShowPwModal(true)}
                                        className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors whitespace-nowrap"
                                    >
                                        비밀번호 변경
                                    </button>
                                </div>
                            </div>
                            {/* [수정] 입학년도 select에 handleYearChange 연결 */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="userYear">입학년도</label>
                                <select
                                    className="form-input"
                                    id="userYear"
                                    value={userYear}
                                    onChange={handleYearChange} // [수정] 여기서 핸들러 호출
                                >
                                    <option value="20학번">20학번</option>
                                    <option value="21학번">21학번</option>
                                    <option value="22학번">22학번</option>
                                    <option value="23학번">23학번</option>
                                    <option value="24학번">24학번</option>
                                    <option value="25학번">25학번</option>
                                </select>
                            </div>
                        </div>
                        {/* (수정!) 전공과 트랙을 2열 그리드로 묶음 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">전공</label>
                                <RadioToggleGroup
                                    options={[
                                        { value: '글로벌SW융합전공', label: '글로벌SW융합전공' },
                                        { value: deepMajorName, label: deepMajorName }
                                    ]}
                                    currentValue={userDepartment}
                                    onChange={handleDepartmentChange} // (수정!) 핸들러 연결
                                />
                            </div>
                            {/* [수정] '심화컴퓨터공학전공'이 아닐 때만 트랙 UI 표시 */}
                            {userDepartment === '글로벌SW융합전공' && (
                                <div className="form-group">
                                    <label className="form-label">트랙</label>
                                    <RadioToggleGroup
                                        options={trackOptions} // [수정] 필터링된 옵션 사용
                                        currentValue={userTrack}
                                        onChange={setUserTrack}
                                    // [수정] 'disabled' 속성 제거 (블록 자체가 숨겨지므로 불필요)
                                    />
                                </div>
                            )}
                        </div>

                        {/* (수정!) '다중전공' 트랙일 때만 이 블록이 보임 */}
                        {userTrack === '다중전공' && (
                            <div className="form-group">
                                <label className="form-label">다중전공 유형</label>
                                <RadioToggleGroup
                                    options={[
                                        { value: '복수전공', label: '복수전공' },
                                        { value: '연계전공', label: '연계전공' },
                                        { value: '융합전공', label: '융합전공' },
                                        { value: '부전공', label: '부전공' }
                                    ]}
                                    currentValue={multiMajorType}
                                    onChange={(value) => setMultiMajorType(value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- 2. 졸업 요건 활동 카드 --- */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-5 border-b border-gray-200 flex items-center gap-3">
                        <Award className="w-5 h-5 text-knu-blue" />
                        <h3 className="text-xl font-semibold">졸업 심사 및 개인 활동</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ActivityToggle
                            label="졸업 인터뷰 통과"
                            checked={passedInterview}
                            onChange={setPassedInterview}
                        />
                        <ActivityToggle
                            label="TOPCIT 통과"
                            checked={passedTopcit}
                            onChange={setPassedTopcit}
                        />
                        <ActivityToggle
                            label="창업여부"
                            checked={isStartup}
                            onChange={setIsStartup}
                        />
                        <ActivityToggle
                            label="해외복수학위과정 이수 (혹은 교환학생 1년 이상)"
                            checked={isExchangeStudent}
                            onChange={setIsExchangeStudent}
                        />
                    </div>
                </div>

                {/* --- 3. 영어 성적 및 기타 카드 --- */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-5 border-b border-gray-200 flex items-center gap-3">
                        <BookMarked className="w-5 h-5 text-knu-blue" />
                        <h3 className="text-xl font-semibold">영어 성적 및 지도교수 상담</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group space-y-2">
                            <label className="form-label">영어 성적</label>
                            <div className="flex gap-4">
                                <select
                                    className="form-input w-1/3"
                                    value={englishTest.testType || "null"}
                                    onChange={(e) => setEnglishTest({ ...englishTest, testType: e.target.value === "null" ? null : e.target.value })}
                                >
                                    <option value="null">어학시험 선택</option>
                                    <option value="TOEIC">TOEIC</option>
                                    <option value="OPIC">OPIC</option>
                                    <option value="TEPS">TEPS</option>
                                    <option value="TOEIC SPEAKING">TOEIC SPEAKING</option>
                                    <option value="PBT">PBT</option>
                                    <option value="IBT">IBT</option>
                                    <option value="CBT">CBT</option>
                                    <option value="TEPS SPEAKING">TEPS SPEAKING</option>
                                    <option value="G-TELP">G-TELP</option>
                                    <option value="IELTS">IELTS</option>
                                </select>
                                <input
                                    type="text"
                                    className="form-input w-2/3"
                                    placeholder="점수 또는 등급 (예: 850 또는 IM2)"
                                    value={englishTest.score || ""}
                                    onChange={(e) => setEnglishTest({ ...englishTest, score: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group space-y-2">
                            <label className="form-label" htmlFor="counselingCount">지도교수 상담 횟수</label>
                            <input
                                className="form-input w-full md:w-1/3"
                                id="counselingCount"
                                type="number"
                                min="0"
                                value={counselingCount}
                                onChange={(e) => setCounselingCount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* [수정] 버튼 영역: 저장 버튼 왼쪽에 '회원 탈퇴' 버튼 추가 */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleWithdraw}
                        className="text-sm text-red-500 hover:text-red-700 hover:underline px-2"
                    >
                        회원 탈퇴
                    </button>

                    <div className="flex items-center">
                        {error && <p className="mr-4 text-sm text-red-600">{error}</p>}
                        <button
                            type="submit"
                            className="w-full md:w-auto justify-center rounded-md bg-knu-blue py-2 px-6 font-medium text-white shadow-sm hover:bg-opacity-80"
                        >
                            저장하기
                        </button>
                    </div>
                </div>
            </form>

            {/* --- 비밀번호 변경 모달 --- */}
            {showPwModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
                    <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                <Lock className="w-5 h-5 text-knu-blue" />
                                비밀번호 변경
                            </h3>
                            <button onClick={() => setShowPwModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                                <input
                                    type="password"
                                    className="form-input w-full"
                                    value={currentPw}
                                    onChange={(e) => setCurrentPw(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                                <input
                                    type="password"
                                    className="form-input w-full"
                                    value={newPw}
                                    onChange={(e) => setNewPw(e.target.value)}
                                    // placeholder="영문 대소문자, 숫자 포함 8자 이상"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    * 영문 대소문자, 숫자, 포함 8자 이상
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                                <input
                                    type="password"
                                    className="form-input w-full"
                                    value={confirmPw}
                                    onChange={(e) => setConfirmPw(e.target.value)}
                                    required
                                />
                            </div>

                            {pwError && (
                                <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                    {pwError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPwModal(false)}
                                    className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 text-white bg-knu-blue rounded-md hover:bg-opacity-90 font-medium shadow-sm transition-colors"
                                >
                                    변경하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

// --- RadioToggleGroup 컴포넌트 ---
const RadioToggleGroup = ({ options, currentValue, onChange, disabled = false }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                (disabled && option.value !== '심컴') ? null : (
                    <button
                        type="button" // 폼 제출 방지
                        key={option.value}
                        onClick={() => !disabled && onChange(option.value)}
                        className={`
                        py-2 px-4 rounded-lg border text-sm font-medium transition-colors
                        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                        ${!disabled && currentValue === option.value
                                ? 'bg-knu-blue text-white border-knu-blue' // Active
                                : ''}
                        ${!disabled && currentValue !== option.value
                                ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' // Inactive
                                : ''}
                    `}
                        disabled={disabled}
                    >
                        {option.label}
                    </button>
                )
            ))}
        </div>
    );
};


// --- ActivityToggle 컴포넌트 ---
const ActivityToggle = ({ label, checked, onChange }) => {
    return (
        <label
            htmlFor={label}
            className={`flex items-center gap-3 rounded-lg border p-4 transition-colors cursor-pointer
            ${checked ? 'border-knu-blue bg-knu-blue-light' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
        >
            <div
                className={`w-5 h-5 flex items-center justify-center rounded border
                ${checked ? 'bg-knu-blue border-knu-blue' : 'bg-white border-gray-400'}`}
            >
                {checked && <Check className="w-4 h-4 text-white" />}
            </div>
            <span
                className={`font-medium
                ${checked ? 'text-knu-blue' : 'text-gray-700'}`}
            >
                {label}
            </span>
            <input
                type="checkbox"
                id={label}
                className="hidden" // (실제 체크박스는 숨김)
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
        </label>
    );
};


export default ProfilePage;