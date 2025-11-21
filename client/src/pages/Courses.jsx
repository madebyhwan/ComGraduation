// client/src/pages/Courses.jsx (수정본)
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LecSearch from '../components/LecSearch.jsx';
import CustomLectureModal from '../components/CustomLectureModal.jsx';
import { getMyLectures, deleteLecture, tossMultiMajor, removeMultiMajor, univToCustom } from '../api/api.js';
// (수정!) 'Pencil' (수정 아이콘) 추가
import { Trash2, ArrowRightSquare, ArrowLeftSquare, Pencil, ChevronDown, ChevronUp, ArrowDownToLine } from 'lucide-react';

const CoursesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [lectures, setLectures] = useState({ univ: [], custom: [], multiMajor: [] });
    const [loading, setLoading] = useState(true);
    const [editingLecture, setEditingLecture] = useState(null);

    // 내 강의 목록 불러오기
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

    const handleApiCall = async (apiFunc, lectureId, successMsg) => {
        try {
            await apiFunc(lectureId);
            toast.success(successMsg, {
                position: "top-right",
                autoClose: 3000
            });
            fetchMyLectures(); // 목록 새로고침
        } catch (error) {
            toast.error(error.response?.data?.message || "작업에 실패했습니다.", {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    // ... (handleDelete, handleToss, handleRemove는 이전과 동일) ...
    const handleDelete = (lectureId) => {
        if (window.confirm("정말로 이 항목을 삭제하시겠습니까?")) {
            handleApiCall(deleteLecture, lectureId, "삭제되었습니다.");
        }
    };
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


    // (추가!) '기타 활동 추가' 버튼 클릭 시
    const handleShowAddModal = () => {
        setEditingLecture(null); // 수정 모드 해제
        setShowModal(true);
    };

    // (추가!) '수정' 버튼 클릭 시 (lec 객체를 받음)
    const handleShowEditModal = (lec) => {
        setEditingLecture(lec); // 수정할 강의 정보 설정
        setShowModal(true);
    };

    // (추가!) 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingLecture(null); // 모달이 닫히면 수정 모드 해제
    };


    return (
        <div>
            <CustomLectureModal
                show={showModal}
                onClose={handleCloseModal} // (수정!)
                onLectureAdded={fetchMyLectures}
                lectureToEdit={editingLecture} // (수정!) 수정할 강의 정보 전달
            />

            <h1 className="text-3xl font-bold mb-6">수강 과목 관리</h1>

            <LecSearch onLectureAdded={fetchMyLectures} />

            {loading ? (
                <div className="text-center p-10">강의 목록을 불러오는 중...</div>
            ) : (
                <div className="mt-8 space-y-8">
                    <LectureList
                        title="수강 내역"
                        lectures={lectures.univ}
                        onDelete={handleDelete}
                        onToss={handleToss}
                        // [추가] 핸들러 전달
                        onUnivToCustom={handleUnivToCustom}
                        type="univ"
                    />

                    <LectureList
                        title="다중전공 이관 내역"
                        lectures={lectures.multiMajor}
                        onDelete={handleDelete}
                        onRemove={handleRemove}
                        type="multiMajor"
                    />

                    <LectureList
                        title="커스텀 과목 & 기타 활동 내역"
                        lectures={lectures.custom}
                        onDelete={handleDelete}
                        onEdit={handleShowEditModal} // (추가!) 수정 핸들러 전달
                        type="custom"
                        onAdd={handleShowAddModal} // (수정!)
                    />
                </div>
            )}
        </div>
    );
};

// [수정] 접기/펼치기 기능이 추가된 LectureList 컴포넌트
const LectureList = ({ title, lectures, onDelete, onToss, onRemove, onEdit,onUnivToCustom, type, onAdd }) => {
    // 기본적으로 펼쳐진 상태(true)로 시작
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200">
            {/* 헤더 영역 */}
            <div 
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-t-lg"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    {/* 접기/펼치기 아이콘 */}
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    <h3 className="text-xl font-semibold select-none">{title}</h3>
                    <span className="text-sm text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                        {lectures.length}건
                    </span>
                </div>

                {/* 버튼 클릭 시에는 토글되지 않도록 stopPropagation */}
                <div onClick={(e) => e.stopPropagation()}>
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80 text-sm"
                        >
                            기타 활동 추가
                        </button>
                    )}
                </div>
            </div>

            {/* 목록 영역 (조건부 렌더링) */}
            {isExpanded && (
                <div className="p-6 border-t border-gray-200 animate-fadeIn">
                    {lectures.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">항목이 없습니다.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {lectures.map(lec => (
                                <li key={lec._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div>
                                    {/* [디자인 통일] LecSearch와 동일한 구조 적용 */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-gray-800">{lec.lectName}</p>
                                            
                                            {/* 학수번호 (custom 제외) */}
                                            {type !== 'custom' && (
                                                 <span className="text-gray-400 text-sm font-normal">({lec.lectCode})</span>
                                            )}
                                            <span className="text-xs text-gray-400">({lec.lectDiv})</span>

                                            {/* 교양구분 뱃지 */}
                                            {lec.lectGeneral && (
                                                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                                                    {lec.lectGeneral}
                                                </span>
                                            )}
                                        </div>

                                        {type === 'custom' ? (
                                            <p className="text-sm text-gray-600 mt-1">
                                                <span className="inline-block bg-green-100 px-2 py-0.5 rounded text-xs mr-2">{lec.lectType}</span>
                                                총 {lec.totalCredit}학점 (해외 {lec.overseasCredit}, 실습 {lec.fieldPracticeCredit})
                                            </p>
                                        ) : (
                                            /* LecSearch와 동일한 하단 정보 표시 */
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
                                      {/* [추가] 기타 활동으로 이동 버튼 (수강 내역일 때만 표시) */}
                                        {type === 'univ' && onUnivToCustom && (
                                            <button 
                                                onClick={() => onUnivToCustom(lec._id)} 
                                                title="커스텀으로 이동" 
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                            >
                                                <ArrowDownToLine className="w-5 h-5" />
                                            </button>
                                        )}
                                        {type === 'univ' && onToss && (
                                            <button
                                                onClick={() => onToss(lec._id)}
                                                title="다중전공으로 이관"
                                                className="p-2 text-knu-blue hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <ArrowRightSquare className="w-5 h-5" />
                                            </button>
                                        )}

                                        {type === 'multiMajor' && onRemove && (
                                            <button
                                                onClick={() => onRemove(lec._id)}
                                                title="수강 내역으로 복귀"
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                            >
                                                <ArrowLeftSquare className="w-5 h-5" />
                                            </button>
                                        )}
                                        {type === 'custom' && onEdit && (
                                            <button
                                                onClick={() => onEdit(lec)}
                                                title="수정"
                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => onDelete(lec._id)}
                                            title="삭제"
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
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