// client/src/pages/Profile.jsx (이 코드로 덮어쓰세요)

import React, { useState, useEffect } from 'react';
import { getMyInfo, updateMyInfo } from '../api/api.js';
// (수정!) 아이콘 import 구문이 맨 위에 있어야 합니다.
import { User, Award, BookMarked, Check } from 'lucide-react';

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    // 폼 제출 (이전과 동일)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const profileData = {
                username,
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

            await updateMyInfo(profileData);
            alert("정보가 성공적으로 저장되었습니다.");
        } catch (error) {
            alert("정보 저장에 실패했습니다.");
            setError(error.response?.data?.message || "저장 중 오류 발생");
        }
    };

    // --- (추가!) 전공 변경 시 트랙을 강제하는 핸들러 ---
    const handleDepartmentChange = (newDepartment) => {
        setUserDepartment(newDepartment);
        // '심화컴퓨터공학전공'을 선택하면
        if (newDepartment === '심화컴퓨터공학전공') {
            setUserTrack('심컴'); // 트랙을 '심컴'으로 강제 변경
        }
        // '글로벌SW융합전공'으로 돌아갈 때, 현재 트랙이 '심컴'이면
        else if (newDepartment === '글로벌SW융합전공' && userTrack === '심컴') {
            setUserTrack('다중전공'); // '다중전공'으로 리셋 (혹은 원하는 기본값)
        }
    };


    if (loading) {
        return <div className="text-center p-10">로딩 중...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">내 정보</h1>

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
                            <div className="form-group">
                                <label className="form-label" htmlFor="studentId">ID</label>
                                <input className="form-input" id="studentId" type="text" value={studentId} disabled />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="userYear">입학년도</label>
                                <input className="form-input" id="userYear" type="text" value={userYear} disabled />
                            </div>
                        </div>

                        {/* (수정!) 전공과 트랙을 2열 그리드로 묶음 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">전공</label>
                                <RadioToggleGroup
                                    options={[
                                        { value: '글로벌SW융합전공', label: '글로벌SW융합전공' },
                                        { value: '심화컴퓨터공학전공', label: '심화컴퓨터공학전공' }
                                    ]}
                                    currentValue={userDepartment}
                                    onChange={handleDepartmentChange} // (수정!) 핸들러 연결
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">트랙</label>
                                <RadioToggleGroup
                                    options={[
                                        { value: '심컴', label: '심컴' },
                                        { value: '다중전공', label: '다중전공' },
                                        { value: '해외복수학위', label: '해외복수학위' },
                                        { value: '학석사연계', label: '학석사연계' }
                                    ]}
                                    currentValue={userTrack}
                                    onChange={setUserTrack}
                                    // (수정!) '심화컴퓨터공학전공'일 때 비활성화
                                    disabled={userDepartment === '심화컴퓨터공학전공'}
                                />
                            </div>
                        </div>

                        {/* (수정!) '다중전공' 트랙일 때만 이 블록이 보임 */}
                        {userTrack === '다중전공' && (
                            <div className="form-group">
                                <label className="form-label">다중전공 유형</label>
                                <RadioToggleGroup
                                    options={[
                                        { value: 'null', label: '(선택 안 함)' },
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

                {/* --- 2. 졸업 요건 활동 카드 --- */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-5 border-b border-gray-200 flex items-center gap-3">
                        <Award className="w-5 h-5 text-knu-blue" />
                        <h3 className="text-xl font-semibold">졸업 요건 활동</h3>
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
                            label="창업 (CEO)"
                            checked={isStartup}
                            onChange={setIsStartup}
                        />
                        <ActivityToggle
                            label="해외 교환학생"
                            checked={isExchangeStudent}
                            onChange={setIsExchangeStudent}
                        />
                    </div>
                </div>

                {/* --- 3. 영어 성적 및 기타 카드 --- */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-5 border-b border-gray-200 flex items-center gap-3">
                        <BookMarked className="w-5 h-5 text-knu-blue" />
                        <h3 className="text-xl font-semibold">영어 성적 및 기타</h3>
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
                                    <option value="null">(시험)</option>
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

                {/* --- 저장 버튼 --- */}
                <div className="flex justify-end items-center">
                    {error && (
                        <p className="mr-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full md:w-auto justify-center rounded-md bg-knu-blue py-2 px-6 font-medium text-white shadow-sm hover:bg-opacity-80"
                    >
                        저장하기
                    </button>
                </div>

            </form>
        </div>
    );
};

// --- RadioToggleGroup 컴포넌트 ---
const RadioToggleGroup = ({ options, currentValue, onChange, disabled = false }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
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