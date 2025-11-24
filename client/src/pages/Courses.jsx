import React, { useState, useEffect, useMemo } from 'react';
import LecSearch from '../components/LecSearch.jsx';
import CustomLectureModal from '../components/CustomLectureModal.jsx';
import { getMyLectures, deleteLecture, tossMultiMajor, removeMultiMajor, univToCustom } from '../api/api.js';
import { Trash2, ArrowRightSquare, ArrowLeftSquare, Pencil, ChevronDown, ChevronUp, ArrowDownToLine, Filter } from 'lucide-react';

const CoursesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [lectures, setLectures] = useState({ univ: [], custom: [], multiMajor: [] });
    const [loading, setLoading] = useState(true);
    const [editingLecture, setEditingLecture] = useState(null);

    // 필터 상태
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

    // 연도 목록 추출
    const years = useMemo(() => {
        const allYears = lectures.univ.map(l => String(l.lectYear)).filter(Boolean);
        return [...new Set(allYears)].sort((a, b) => Number(b) - Number(a));
    }, [lectures.univ]);

    // 필터링 로직
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
<<<<<<< HEAD
=======
    // [추가] 수강 내역 -> 기타 활동 이동 핸들러
    const handleUnivToCustom = async (lectureId) => {
        if (window.confirm("이 과목을 '커스텀 과목'으로 이동하시겠습니까?")) {
            try {
                await univToCustom(lectureId);
                toast.success("커스텀 과목으로 이동되었습니다.", {
                    position: "top-right",
                    autoClose: 3000
                });
                fetchMyLectures(); // 목록 새로고침
            } catch (error) {
                toast.error(error.response?.data?.message || "이동에 실패했습니다.", {
                    position: "top-right",
                    autoClose: 3000
                });
            }
        }
    };
>>>>>>> b57eb9f4a7734e756a8708f393f8e4d983a27d73
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
        if (window.confirm("이 과목을 '커스텀 과목'으로 이동하시겠습니까?")) {
            try {
                await univToCustom(lectureId);
                alert("커스텀 과목으로 이동되었습니다.");
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
        <div>
            <CustomLectureModal
                show={showModal}
                onClose={handleCloseModal}
                onLectureAdded={fetchMyLectures}
                lectureToEdit={editingLecture}
            />

            <h1 className="text-3xl font-bold mb-6">수강 과목 관리</h1>

            <LecSearch onLectureAdded={fetchMyLectures} />

            {loading ? (
                <div className="text-center p-10">강의 목록을 불러오는 중...</div>
            ) : (
                <div className="mt-8 space-y-8">
                    
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
                        title="커스텀 과목(강의 수정) 및 교과목 외 활동 내역"
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

// [수정] 뱃지 색상 로직 (전공필수 분홍색 변경)
const getBadgeStyle = (category) => {
    if (!category) return 'bg-gray-100 text-gray-600 border-gray-200';
    
    const cat = category.trim(); 

    // 1. 전공필수 -> 분홍색 (pink)
    if (cat === '전공필수' || cat === '전필' || cat.includes('전공필수')) {
        return 'bg-pink-50 text-pink-600 border-pink-200';
    }
    // 2. 전공, 공학전공 -> 파란색
    if (cat.includes('전공') || cat.includes('공학')) {
        return 'bg-blue-50 text-blue-600 border-blue-200';
    }
    // 3. 일반선택 -> 보라색
    if (cat.includes('일반선택')) {
        return 'bg-purple-50 text-purple-600 border-purple-200';
    }
    // 4. 교양, 기본소양 -> 초록색
    if (cat.includes('교양') || cat.includes('기본소양') || cat.includes('교필') || cat.includes('교선')) {
        return 'bg-green-50 text-green-600 border-green-200';
    }
    
    // 5. 나머지 -> 회색
    return 'bg-gray-100 text-gray-600 border-gray-200';
};

const LectureList = ({ 
    title, lectures, onDelete, onToss, onRemove, onEdit, onUnivToCustom, type, onAdd,
    isFilterable, years, selectedYear, onYearChange, selectedSemester, onSemesterChange
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const selectStyle = "h-8 pl-2 pr-6 rounded-md border border-gray-300 text-xs focus:ring-1 focus:ring-knu-blue focus:border-knu-blue outline-none bg-white cursor-pointer";

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200">
            <div 
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-t-lg"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    <h3 className="text-xl font-semibold select-none">{title}</h3>
                    <span className="text-sm text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                        {lectures.length}건
                    </span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isFilterable && (
                        <div className="flex gap-2 mr-2">
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
                            className="rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80 text-sm"
                        >
                            교과목 외 활동 추가
                        </button>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 border-t border-gray-200 animate-fadeIn">
                    {lectures.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">항목이 없습니다.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {lectures.map(lec => (
                                <li key={lec._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-gray-800">{lec.lectName}</p>
                                            
                                            {/* [수정] 과목코드 포맷: (코드)(분반) */}
                                            {type !== 'custom' && (
                                                <span className="text-gray-400 text-sm font-normal">
                                                    ({lec.lectCode}){lec.lectDiv ? `(${lec.lectDiv})` : ''}
                                                </span>
                                            )}

                                            {/* 교과구분 뱃지 (수강내역/다중전공용) */}
                                            {lec.lectGeneral && type !== 'custom' && (
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getBadgeStyle(lec.lectGeneral)}`}>
                                                    {lec.lectGeneral}
                                                </span>
                                            )}
                                        </div>

                                        {type === 'custom' ? (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {/* [수정] 기타 활동 뱃지도 getBadgeStyle로 통일 */}
                                                <span className={`inline-block px-2 py-0.5 rounded-full border text-xs mr-2 ${getBadgeStyle(lec.lectType)}`}>
                                                    {lec.lectType}
                                                </span>
                                                총 {lec.totalCredit}학점 (해외 {lec.overseasCredit}, 실습 {lec.fieldPracticeCredit})
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-600 mt-1 flex flex-wrap gap-2 items-center">
                                                <span>{lec.lectProfessor || '교수미정'}</span>
                                                <span>|</span>
                                                <span>{lec.lectYear}년 {lec.lectSemester}</span>
                                                <span>|</span>
                                                {lec.lectTime && (
                                                    <>
                                                        <span>{lec.lectTime}</span>
                                                        <span>|</span>
                                                    </>
                                                )}
                                                <span className="font-medium text-knu-blue">{lec.lectCredit}학점</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {type === 'univ' && onUnivToCustom && (
                                            <button onClick={() => onUnivToCustom(lec._id)} title="커스텀 과목으로 이동" className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
                                                <ArrowDownToLine className="w-5 h-5" />
                                            </button>
                                        )}
                                        {type === 'univ' && onToss && (
                                            <button onClick={() => onToss(lec._id)} title="다중전공으로 이관" className="p-2 text-knu-blue hover:bg-blue-50 rounded-full transition-colors">
                                                <ArrowRightSquare className="w-5 h-5" />
                                            </button>
                                        )}
                                        {type === 'multiMajor' && onRemove && (
                                            <button onClick={() => onRemove(lec._id)} title="수강 내역으로 복귀" className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                                                <ArrowLeftSquare className="w-5 h-5" />
                                            </button>
                                        )}
                                        {type === 'custom' && onEdit && (
                                            <button onClick={() => onEdit(lec)} title="수정" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button onClick={() => onDelete(lec._id)} title="삭제" className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 className="w-5 h-5" />
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

export default CoursesPage;