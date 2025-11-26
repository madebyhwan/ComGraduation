import React, { useState, useEffect, useMemo } from 'react';
import LecSearch from '../components/LecSearch.jsx';
import CustomLectureModal from '../components/CustomLectureModal.jsx';
import { getMyLectures, deleteLecture, tossMultiMajor, removeMultiMajor, univToCustom } from '../api/api.js';
import { Trash2, ArrowRightSquare, ArrowLeftSquare, Pencil, ChevronDown, ChevronUp, ArrowDownToLine, Filter } from 'lucide-react';

// 뱃지 색상 로직
const getBadgeStyle = (category) => {
    if (!category) return 'bg-gray-100 text-gray-600 border-gray-200';

    const cat = category.trim();

    if (cat === '전공필수' || cat === '전필' || cat.includes('전공필수')) {
        return 'bg-pink-50 text-pink-600 border-pink-200';
    }
    if (cat.includes('전공') || cat.includes('공학')) {
        return 'bg-blue-50 text-blue-600 border-blue-200';
    }
    if (cat.includes('일반선택')) {
        return 'bg-purple-50 text-purple-600 border-purple-200';
    }
    if (cat.includes('교양') || cat.includes('기본소양') || cat.includes('교필') || cat.includes('교선')) {
        return 'bg-green-50 text-green-600 border-green-200';
    }
    return 'bg-gray-100 text-gray-600 border-gray-200';
};

const LectureList = ({
    title, lectures, onDelete, onToss, onRemove, onEdit, onUnivToCustom, type, onAdd,
    isFilterable, years, selectedYear, onYearChange, selectedSemester, onSemesterChange
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    // [복구] 기존 크기(h-8, text-xs) 유지
    const selectStyle = "h-8 pl-2 pr-6 rounded-md border border-gray-300 text-xs focus:ring-1 focus:ring-knu-blue focus:border-knu-blue outline-none bg-white cursor-pointer";

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200">
            {/* [수정] 헤더 패딩은 적당히 유지하되 불필요하게 넓지 않게 (p-4) */}
            <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-t-lg"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}

                    <h3 className="text-lg sm:text-xl font-semibold select-none break-keep">
                        {title.split('(')[0]}
                        <span className="block text-sm font-normal text-gray-500 sm:inline sm:ml-2">
                            {title.includes('(') ? `(${title.split('(')[1]}` : ''}
                        </span>
                    </h3>
                    <span className="text-sm text-gray-500 ml-auto sm:ml-2 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                        {lectures.length}건
                    </span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isFilterable && (
                        <div className="hidden sm:flex gap-2 mr-2 items-center">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={selectedYear}
                                onChange={(e) => onYearChange(e.target.value)}
                                className={selectStyle}
                            >
                                <option value="all">전체 연도</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}년</option>
                                ))}
                            </select>
                            <select
                                value={selectedSemester}
                                onChange={(e) => onSemesterChange(e.target.value)}
                                className={selectStyle}
                            >
                                <option value="all">전체 학기</option>
                                <option value="1학기">1학기</option>
                                <option value="2학기">2학기</option>
                                <option value="계절학기(하계)">하계</option>
                                <option value="계절학기(동계)">동계</option>
                            </select>
                        </div>
                    )}

                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="rounded-md bg-knu-blue py-1.5 px-3 font-medium text-white shadow-sm hover:bg-opacity-80 text-xs sm:text-sm whitespace-nowrap"
                        >
                            교과목 외 활동 추가
                        </button>
                    )}
                </div>
            </div>

            {/* 모바일용 필터 (확장 시 노출) */}
            {isExpanded && isFilterable && (
                <div className="sm:hidden px-4 pb-3 flex gap-2">
                    <select
                        value={selectedYear}
                        onChange={(e) => onYearChange(e.target.value)}
                        className={`${selectStyle} flex-1`}
                    >
                        <option value="all">전체 연도</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}년</option>
                        ))}
                    </select>
                    <select
                        value={selectedSemester}
                        onChange={(e) => onSemesterChange(e.target.value)}
                        className={`${selectStyle} flex-1`}
                    >
                        <option value="all">전체 학기</option>
                        <option value="1학기">1학기</option>
                        <option value="2학기">2학기</option>
                        <option value="계절학기(하계)">하계</option>
                        <option value="계절학기(동계)">동계</option>
                    </select>
                </div>
            )}

            {isExpanded && (
                <div className="border-t border-gray-200 animate-fadeIn">
                    {lectures.length === 0 ? (
                        <p className="text-gray-500 text-center py-6 text-sm">항목이 없습니다.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {lectures.map(lec => (
                                // [복구] 패딩 적당히 유지 (py-3 px-4) - 너무 좁지 않게
                                <li key={lec._id} className="flex items-start justify-between py-3 px-4 hover:bg-gray-50 transition-colors gap-3">

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base break-keep leading-tight">
                                                {lec.lectName}
                                            </h4>

                                            {lec.lectGeneral && type !== 'custom' && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 self-start mt-0.5 ${getBadgeStyle(lec.lectGeneral)}`}>
                                                    {lec.lectGeneral}
                                                </span>
                                            )}
                                            {type === 'custom' && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 self-start mt-0.5 ${getBadgeStyle(lec.lectType)}`}>
                                                    {lec.lectType}
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-xs sm:text-sm text-gray-500 space-y-0.5">
                                            {type !== 'custom' && (
                                                <p className="truncate">
                                                    <span className="font-medium">{lec.lectCode}</span>
                                                    {lec.lectDiv && <span className="text-gray-400 ml-1">({lec.lectDiv})</span>}
                                                </p>
                                            )}

                                            {type === 'custom' ? (
                                                <p>
                                                    총 {lec.totalCredit}학점 (해외 {lec.overseasCredit}, 실습 {lec.fieldPracticeCredit}, 창업 {lec.startupCourseCredit})
                                                </p>
                                            ) : (
                                                <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                                                    <span>{lec.lectProfessor || '교수미정'}</span>
                                                    <span className="hidden sm:inline text-gray-300">|</span>
                                                    <span>{lec.lectYear}-{lec.lectSemester}</span>
                                                    <span className="hidden sm:inline text-gray-300">|</span>
                                                    {lec.lectTime && (
                                                        <span className="truncate max-w-[120px] sm:max-w-none" title={lec.lectTime}>
                                                            {lec.lectTime}
                                                        </span>
                                                    )}
                                                    <span className="font-medium text-knu-blue ml-1">{lec.lectCredit}학점</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-1 sm:gap-2 shrink-0 self-start mt-0.5">
                                        {type === 'univ' && onUnivToCustom && (
                                            <button onClick={() => onUnivToCustom(lec._id)} title="수강 과목 수정으로 이동" className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
                                                <ArrowDownToLine className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        )}
                                        {type === 'univ' && onToss && (
                                            <button onClick={() => onToss(lec._id)} title="다중전공으로 이관" className="p-1.5 text-knu-blue hover:bg-blue-50 rounded-full transition-colors">
                                                <ArrowRightSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        )}
                                        {type === 'multiMajor' && onRemove && (
                                            <button onClick={() => onRemove(lec._id)} title="수강 내역으로 복귀" className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                                                <ArrowLeftSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        )}
                                        {type === 'custom' && onEdit && (
                                            <button onClick={() => onEdit(lec)} title="수정" className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                                <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        )}
                                        <button onClick={() => onDelete(lec._id)} title="삭제" className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

const CoursesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [lectures, setLectures] = useState({ univ: [], custom: [], multiMajor: [] });
    const [loading, setLoading] = useState(true);
    const [editingLecture, setEditingLecture] = useState(null);

    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedSemester, setSelectedSemester] = useState('all');

    const fetchMyLectures = async () => {
        try {
            setLoading(true);
            const data = await getMyLectures();
            if (data.data) {
                setLectures(data.data);
            }
        } catch (error) {
            console.error("강의 목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyLectures();
    }, []);

    const years = useMemo(() => {
        const allYears = lectures.univ.map(l => String(l.lectYear)).filter(Boolean);
        return [...new Set(allYears)].sort((a, b) => Number(b) - Number(a));
    }, [lectures.univ]);

    const filteredUnivLectures = useMemo(() => {
        return lectures.univ.filter(lec => {
            const lecYearStr = String(lec.lectYear);
            const yearMatch = selectedYear === 'all' || lecYearStr === selectedYear;
            const semesterMatch = selectedSemester === 'all' || lec.lectSemester === selectedSemester;
            return yearMatch && semesterMatch;
        });
    }, [lectures.univ, selectedYear, selectedSemester]);

    const handleApiCall = async (apiFunc, lectureId, successMsg) => {
        try {
            await apiFunc(lectureId);
            alert(successMsg);
            fetchMyLectures();
        } catch (error) {
            alert(error.response?.data?.message || "작업에 실패했습니다.");
        }
    };

    const handleDelete = (lectureId) => {
        if (window.confirm("정말로 이 항목을 삭제하시겠습니까?")) {
            handleApiCall(deleteLecture, lectureId, "삭제되었습니다.");
        }
    };
    const handleToss = (lectureId) => {
        if (window.confirm("이 과목을 다중전공 학점으로 이관하시겠습니까?")) {
            handleApiCall(tossMultiMajor, lectureId, "다중전공 학점으로 이관되었습니다.");
        }
    };
    const handleRemove = (lectureId) => {
        if (window.confirm("이 과목을 일반 수강 내역으로 복귀하시겠습니까?")) {
            handleApiCall(removeMultiMajor, lectureId, "수강 내역으로 복귀되었습니다.");
        }
    };
    const handleUnivToCustom = async (lectureId) => {
        if (window.confirm("이 과목을 '수강 과목 수정'으로 이동하시겠습니까?")) {
            try {
                await univToCustom(lectureId);
                alert("수강 과목 수정으로 이동되었습니다.");
                fetchMyLectures();
            } catch (error) {
                alert(error.response?.data?.message || "이동에 실패했습니다.");
            }
        }
    };

    const handleShowAddModal = () => {
        setEditingLecture(null);
        setShowModal(true);
    };

    const handleShowEditModal = (lec) => {
        setEditingLecture(lec);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingLecture(null);
    };

    return (
        // [핵심 수정] 페이지 전체 패딩 축소
        // - px-2: 모바일에서 좌우 회색 여백 최소화 (기존 px-4 대비 절반)
        // - py-4: 상하 회색 여백 축소 (기존 py-6/8 대비 축소)
        // - max-w-7xl: PC 화면에서도 넓게 쓰도록 확장
        <div className="max-w-7xl mx-auto">
            <CustomLectureModal
                show={showModal}
                onClose={handleCloseModal}
                onLectureAdded={fetchMyLectures}
                lectureToEdit={editingLecture}
            />

            <div>
                <h1 className="text-[1.6rem] md:text-3xl font-bold mb-6">수강 과목 관리</h1>
            </div>

            <LecSearch onLectureAdded={fetchMyLectures} />

            {loading ? (
                <div className="text-center p-10 text-gray-500">강의 목록을 불러오는 중...</div>
            ) : (
                // [핵심 수정] 컴포넌트 간 회색 간격 축소 (space-y-3)
                <div className="mt-3 space-y-3">

                    <LectureList
                        title="수강 내역"
                        lectures={filteredUnivLectures}
                        onDelete={handleDelete}
                        onToss={handleToss}
                        onUnivToCustom={handleUnivToCustom}
                        type="univ"
                        isFilterable={true}
                        years={years}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                        selectedSemester={selectedSemester}
                        onSemesterChange={setSelectedSemester}
                    />

                    <LectureList
                        title="다중전공 이관 내역"
                        lectures={lectures.multiMajor}
                        onDelete={handleDelete}
                        onRemove={handleRemove}
                        type="multiMajor"
                    />

                    <LectureList
                        title="수강 과목 수정 및 교과목 외 활동 내역"
                        lectures={lectures.custom}
                        onDelete={handleDelete}
                        onEdit={handleShowEditModal}
                        type="custom"
                        onAdd={handleShowAddModal}
                    />
                </div>
            )}
        </div>
    );
};

export default CoursesPage;