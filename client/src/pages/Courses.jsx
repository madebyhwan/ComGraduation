// client/src/pages/Courses.jsx (수정본)
import React, { useState, useEffect } from 'react';
import LecSearch from '../components/LecSearch.jsx';
import CustomLectureModal from '../components/CustomLectureModal.jsx';
import { getMyLectures, deleteLecture, tossMultiMajor, removeMultiMajor } from '../api/api.js';
// (수정!) 'Pencil' (수정 아이콘) 추가
import { Trash2, ArrowRightSquare, ArrowLeftSquare, Pencil } from 'lucide-react';

const CoursesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [lectures, setLectures] = useState({ univ: [], custom: [], multiMajor: [] });
    const [loading, setLoading] = useState(true);
    // (추가!) 현재 수정 중인 강의 정보를 저장할 state
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
            alert(successMsg);
            fetchMyLectures(); // 목록 새로고침
        } catch (error) {
            alert(error.response?.data?.message || "작업에 실패했습니다.");
        }
    };

    // ... (handleDelete, handleToss, handleRemove는 이전과 동일) ...
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
                        title="기타 활동 내역"
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

// (수정!) 'onEdit' prop 추가
const LectureList = ({ title, lectures, onDelete, onToss, onRemove, onEdit, type, onAdd }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold">{title}</h3>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80"
                >
                    기타 활동 추가
                </button>
            )}
        </div>
        <div className="p-6">
            {lectures.length === 0 ? (
                <p className="text-gray-500">항목이 없습니다.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {lectures.map(lec => (
                        <li key={lec._id} className="flex items-center justify-between p-3">
                            <div>
                                <p className="font-semibold text-gray-800">{lec.lectName} <span className="text-gray-500 text-sm font-normal">({lec.lectCode})</span></p>
                                {type === 'custom' ? (
                                    <p className="text-sm text-gray-600">
                                        {lec.lectType} | 총 {lec.totalCredit}학점 (해외 {lec.overseasCredit}, 실습 {lec.fieldPracticeCredit})
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-600">
                                      {lec.lectProfessor} | {lec.lectYear}년 {lec.lectSemester} | {lec.lectTime} | <span className="font-medium text-knu-blue">{lec.lectCredit}학점</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {type === 'univ' && onToss && (
                                    <button
                                        onClick={() => onToss(lec._id)}
                                        title="다중전공으로 이관"
                                        className="text-knu-blue hover:text-opacity-80"
                                    >
                                        <ArrowRightSquare className="w-5 h-5" />
                                    </button>
                                )}
                                {type === 'multiMajor' && onRemove && (
                                    <button
                                        onClick={() => onRemove(lec._id)}
                                        title="수강 내역으로 복귀"
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        <ArrowLeftSquare className="w-5 h-5" />
                                    </button>
                                )}

                                {/* (추가!) '기타 활동'일 때만 수정 버튼 표시 */}
                                {type === 'custom' && onEdit && (
                                    <button
                                        onClick={() => onEdit(lec)} // (lec 객체 전체를 전달)
                                        title="수정"
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                )}

                                <button
                                    onClick={() => onDelete(lec._id)}
                                    title="삭제"
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
);

export default CoursesPage;