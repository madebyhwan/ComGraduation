import React, { useState, useEffect } from 'react';
import { getMyInfo, updateMyInfo } from '../api/api.js';
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
    // (수정!) counselingCount는 숫자(0) 또는 빈 문자열("")이 될 수 있습니다.
    const [counselingCount, setCounselingCount] = useState(0);


    // 데이터 로딩
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await getMyInfo();
                if (data && data.user) {
                    const user = data.user;
                    // 수정 불가능한 정보
                    setStudentId(user.userId);
                    setUserYear(user.userYear);

                    // 수정 가능한 정보
                    setUsername(user.username);
                    setUserDepartment(user.userDepartment);
                    setUserTrack(user.userTrack);
                    setMultiMajorType(user.multiMajorType || null);
                    setEnglishTest(user.englishTest || { testType: null, score: '' });
                    setPassedInterview(user.passedInterview);
                    setPassedTopcit(user.passedTopcit);
                    setIsStartup(user.isStartup);
                    setIsExchangeStudent(user.isExchangeStudent);
                    setCounselingCount(user.counselingCount || 0); // null/undefined 방지
                }
            } catch (error) {
                console.error("내 정보 로딩 실패:", error);
                setError("정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        }
        fetchInfo();
    }, []); // 처음 로드될 때 한 번만 실행

    // 폼 제출 (수정)
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
                // (수정!) 빈 문자열("")일 경우 0으로 변환해서 전송
                counselingCount: Number(counselingCount || 0)
            };

            await updateMyInfo(profileData);
            alert("정보가 성공적으로 저장되었습니다.");
        } catch (error) {
            alert("정보 저장에 실패했습니다.");
            setError(error.response?.data?.message || "저장 중 오류 발생");
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

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* (이름, 학번, 입학년도, 전공, 트랙, 다중전공 유형 폼... 이전과 동일) */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">이름</label>
                            <input className="form-input" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="studentId">학번 (ID)</label>
                            <input className="form-input" id="studentId" type="text" value={studentId} disabled />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="userYear">입학년도</label>
                            <input className="form-input" id="userYear" type="text" value={userYear} disabled />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="userDepartment">전공</label>
                            <select
                                className="form-input"
                                id="userDepartment"
                                value={userDepartment}
                                onChange={(e) => setUserDepartment(e.target.value)}
                            >
                                <option value="글로벌SW융합전공">글로벌SW융합전공</option>
                                <option value="심화컴퓨터공학전공">심화컴퓨터공학전공</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="userTrack">트랙</label>
                            <select
                                className="form-input"
                                id="userTrack"
                                value={userTrack}
                                onChange={(e) => setUserTrack(e.target.value)}
                            >
                                <option value="심컴">심컴</option>
                                <option value="다중전공">다중전공</option>
                                <option value="해외복수학위">해외복수학위</option>
                                <option value="학석사연계">학석사연계</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="multiMajorType">다중전공 유형</label>
                            <select
                                className="form-input"
                                id="multiMajorType"
                                value={multiMajorType || "null"}
                                onChange={(e) => setMultiMajorType(e.target.value)}
                                disabled={userTrack !== '다중전공'}
                            >
                                <option value="null">(선택 안 함)</option>
                                <option value="복수전공">복수전공</option>
                                <option value="연계전공">연계전공</option>
                                <option value="융합전공">융합전공</option>
                                <option value="부전공">부전공</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- 2. 졸업 요건 활동 카드 --- */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-5 border-b border-gray-200 flex items-center gap-3">
                        <Award className="w-5 h-5 text-knu-blue" />
                        <h3 className="text-xl font-semibold">졸업 요건 활동</h3>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* (체크박스 4개... 이전과 동일) */}
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
                        {/* 영어 성적 */}
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

                        {/* 상담 횟수 */}
                        <div className="form-group space-y-2">
                            <label className="form-label" htmlFor="counselingCount">지도교수 상담 횟수</label>
                            <input
                                className="form-input"
                                id="counselingCount"
                                type="number"
                                min="0"
                                value={counselingCount}
                                // (수정!) Number()를 제거하고 문자열 그대로 저장
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

// --- (추가) 커스텀 체크박스 하위 컴포넌트 ---
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