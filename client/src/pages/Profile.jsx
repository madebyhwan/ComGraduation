import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyInfo, updateMyInfo, changePassword, withdrawUser } from '../api/api.js';
import { User, Award, BookMarked, Check, Lock, X } from 'lucide-react';

// 트랙 옵션 상수
const allTrackOptions = [
    { value: '심컴', label: '심컴' },
    { value: '다중전공', label: '다중전공' },
    { value: '해외복수학위', label: '해외복수학위' },
    { value: '학석사연계', label: '학석사연계' }
];

const ProfilePage = () => {
    const { updateUsername } = useOutletContext();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- 비밀번호 변경 모달 관련 상태 ---
    const [showPwModal, setShowPwModal] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwError, setPwError] = useState('');

    // --- 사용자 정보 상태 ---
    const [username, setUsername] = useState('');
    const [studentId, setStudentId] = useState('');
    const [userYear, setUserYear] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userTrack, setUserTrack] = useState('');
    const [multiMajorType, setMultiMajorType] = useState(null);

    const [englishTest, setEnglishTest] = useState({ testType: null, score: '' });
    const [passedInterview, setPassedInterview] = useState(false);
    const [passedTopcit, setPassedTopcit] = useState(false);
    const [isStartup, setIsStartup] = useState(false);
    const [isExchangeStudent, setIsExchangeStudent] = useState(false);
    const [counselingCount, setCounselingCount] = useState(0);

    // 학번별 선택 가능한 전공 목록 반환 함수
    const getAvailableMajors = (year) => {
        const newMajorYears = ['23학번', '24학번', '25학번'];
        if (newMajorYears.includes(year)) {
            return ['글로벌SW융합전공', '플랫폼SW&데이터과학전공', '인공지능컴퓨팅전공'];
        }
        return ['글로벌SW융합전공', '심화컴퓨터공학전공'];
    };

    // 데이터 로딩
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

    // [수정] 학번 변경 핸들러
    const handleYearChange = (e) => {
        const newYear = e.target.value;
        setUserYear(newYear);

        const validMajors = getAvailableMajors(newYear);
        
        if (!validMajors.includes(userDepartment)) {
            if (userDepartment === '심화컴퓨터공학전공') {
                setUserDepartment('플랫폼SW&데이터과학전공');
                // 플랫폼SW는 심컴 트랙 유지
            } else {
                setUserDepartment('');
                setUserTrack(''); // 초기화
            }
        }
    };

    // [수정] 전공 변경 핸들러
    const handleDepartmentChange = (newDepartment) => {
        setUserDepartment(newDepartment);
        
        if (newDepartment === '글로벌SW융합전공') {
            // 기존에 심컴/인컴이었다면 트랙 초기화 (글솝 트랙 선택 유도)
            if (userTrack === '심컴' || userTrack === '인컴') {
                setUserTrack('');
            }
        } else if (newDepartment === '인공지능컴퓨팅전공') {
            setUserTrack('인컴'); // [중요] 인컴 설정
        } else {
            // 심화컴퓨터 or 플랫폼SW
            setUserTrack('심컴');
        }
    };

    // 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const profileData = {
                username,
                userYear, // 입학년도 수정 반영
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

            const responseData = await updateMyInfo(profileData);
            
            // 업데이트 성공 시 처리
            if (responseData && responseData.user && responseData.user.username) {
                updateUsername(responseData.user.username);
            } else {
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

    // 비밀번호 변경
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
        if (!/(?=.*[a-zA-Z])/.test(newPw)) {
            setPwError('비밀번호는 영문를 포함해야 합니다.');
            return;
        }
        if (!/(?=.*\d)/.test(newPw)) {
            setPwError('비밀번호는 숫자를 포함해야 합니다.');
            return;
        }

        try {
            await changePassword({ currentPassword: currentPw, newPassword: newPw });
            toast.success('비밀번호가 변경되었습니다.');
            setShowPwModal(false);
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
        } catch (err) {
            setPwError(err.response?.data?.message || '비밀번호 변경 실패');
        }
    };

    // 회원 탈퇴
    const handleWithdraw = async () => {
        if (window.confirm("정말로 탈퇴하시겠습니까?\n탈퇴 시 수강 내역 등 모든 데이터가 삭제되며 복구할 수 없습니다.")) {
            try {
                await withdrawUser();
                alert("회원 탈퇴가 완료되었습니다.");
                localStorage.removeItem('token');
                navigate('/');
            } catch (error) {
                alert(error.response?.data?.message || "탈퇴 처리에 실패했습니다.");
            }
        }
    };

    if (loading) return <div className="text-center p-10">로딩 중...</div>;

    // 현재 학번에 맞는 전공 옵션 생성
    const departmentOptions = getAvailableMajors(userYear).map(dep => ({
        value: dep,
        label: dep
    }));

    // 글로벌SW용 트랙 옵션
    const trackOptions = userDepartment === '글로벌SW융합전공'
        ? allTrackOptions.filter(option => option.value !== '심컴')
        : allTrackOptions;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">내 정보</h1>

            <form className="space-y-8" onSubmit={handleSubmit}>
                
                {/* 1. 기본 정보 */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-5 border-b border-gray-200 flex items-center gap-3">
                        <User className="w-5 h-5 text-knu-blue" />
                        <h3 className="text-xl font-semibold">기본 정보</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="username">이름</label>
                                <input className="form-input" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            
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

                            <div className="form-group">
                                <label className="form-label" htmlFor="userYear">입학년도</label>
                                <select
                                    className="form-input"
                                    id="userYear"
                                    value={userYear}
                                    onChange={handleYearChange}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">전공</label>
                                <div className="flex flex-col gap-2"> 
                                    <RadioToggleGroup
                                        options={departmentOptions}
                                        currentValue={userDepartment}
                                        onChange={handleDepartmentChange}
                                    />
                                </div>
                            </div>
                            
                            {/* 글로벌SW일 때만 트랙 선택 표시 */}
                            {userDepartment === '글로벌SW융합전공' && (
                                <div className="form-group">
                                    <label className="form-label">트랙</label>
                                    <RadioToggleGroup
                                        options={trackOptions}
                                        currentValue={userTrack}
                                        onChange={setUserTrack}
                                    />
                                </div>
                            )}
                        </div>

                        {userTrack === '다중전공' && (
                            <div className="form-group">
                                <label className="form-label">다중전공 유형</label>
                                <RadioToggleGroup
                                    options={[
                                        { value: 'null', label: '미선택' },
                                        { value: '복수전공', label: '복수전공' },
                                        { value: '연계전공', label: '연계전공' },
                                        { value: '융합전공', label: '융합전공' },
                                        { value: '부전공', label: '부전공' }
                                    ]}
                                    currentValue={multiMajorType || "null"}
                                    onChange={(value) => setMultiMajorType(value === "null" ? null : value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. 졸업 요건 활동 */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-5 border-b border-gray-200 flex items-center gap-3">
                        <Award className="w-5 h-5 text-knu-blue" />
                        <h3 className="text-xl font-semibold">졸업 심사 및 개인 활동</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ActivityToggle label="졸업 인터뷰" checked={passedInterview} onChange={setPassedInterview} />
                        <ActivityToggle label="TOPCIT 응시" checked={passedTopcit} onChange={setPassedTopcit} />
                        <ActivityToggle label="창업 여부" checked={isStartup} onChange={setIsStartup} />
                        <ActivityToggle label="해외 교환학생 여부(1년 이상)" checked={isExchangeStudent} onChange={setIsExchangeStudent} />
                    </div>
                </div>

                {/* 3. 영어 성적 및 기타 */}
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

            {/* 비밀번호 변경 모달 */}
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
                                    placeholder="8자 이상 (영문, 숫자, 특수문자)"
                                    required
                                />
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

const RadioToggleGroup = ({ options, currentValue, onChange, disabled = false }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                (disabled && option.value !== '심컴') ? null : (
                <button
                    type="button"
                    key={option.value}
                    onClick={() => !disabled && onChange(option.value)}
                    className={`
                        py-2 px-4 rounded-lg border text-sm font-medium transition-colors
                        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                        ${!disabled && currentValue === option.value
                            ? 'bg-knu-blue text-white border-knu-blue'
                            : ''}
                        ${!disabled && currentValue !== option.value
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                className="hidden"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
        </label>
    );
};

export default ProfilePage;