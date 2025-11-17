import React, { useState, useEffect } from 'react';
import { addCustomLecture, updateCustomLecture } from '../api/api.js';

const CustomLectureModal = ({ show, onClose, onLectureAdded, lectureToEdit }) => {
  const isEditMode = !!lectureToEdit;

  const [lectName, setLectName] = useState('');
  const [lectType, setLectType] = useState('전공');
  // (수정!) 학점 필드도 빈 문자열("")을 허용하도록 초기값을 0 대신 ""로 설정
  const [overseasCredit, setOverseasCredit] = useState('');
  const [fieldPracticeCredit, setFieldPracticeCredit] = useState('');
  const [totalCredit, setTotalCredit] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      // 수정할 강의 데이터로 폼 상태 설정 (null/undefined/0을 빈 문자열로)
      setLectName(lectureToEdit.lectName);
      setLectType(lectureToEdit.lectType);
      setOverseasCredit(lectureToEdit.overseasCredit || '');
      setFieldPracticeCredit(lectureToEdit.fieldPracticeCredit || '');
      setTotalCredit(lectureToEdit.totalCredit || '');
    } else {
      // '추가 모드'일 때, 폼을 리셋합니다.
      setLectName('');
      setLectType('전공');
      setOverseasCredit('');
      setFieldPracticeCredit('');
      setTotalCredit('');
    }
  }, [lectureToEdit, show, isEditMode]);

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // (수정!) api.js가 || 0 처리를 해주므로, state 그대로 전송
    const lectureData = {
      lectName,
      lectType,
      overseasCredit,
      fieldPracticeCredit,
      totalCredit
    };

    try {
      if (isEditMode) {
        await updateCustomLecture(lectureToEdit._id, lectureData);
        alert('기타 활동이 수정되었습니다.');
      } else {
        await addCustomLecture(lectureData);
        alert('기타 활동이 추가되었습니다.');
      }

      if (onLectureAdded) onLectureAdded();
      onClose();

    } catch (error) {
      setError(error.response?.data?.message || "작업 중 오류 발생");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? '기타 활동 수정' : '기타 활동 추가'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          해외대학, 현장실습 등 강의계획서에 없는 활동을 관리합니다.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="lectName">활동명</label>
            <input
              type="text"
              id="lectName"
              className="form-input"
              value={lectName}
              onChange={(e) => setLectName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="lectType">교과 구분</label>
            <select
              id="lectType"
              className="form-input"
              value={lectType}
              onChange={(e) => setLectType(e.target.value)}
            >
              <option value="전공">전공</option>
              <option value="교양">교양</option>
              <option value="일반선택">일반선택</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="totalCredit">총 학점</label>
              <input
                type="number"
                id="totalCredit"
                className="form-input"
                min="0"
                value={totalCredit}
                // (수정!) Number() 제거
                onChange={(e) => setTotalCredit(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="overseasCredit">해외 학점</label>
              <input
                type="number"
                id="overseasCredit"
                className="form-input"
                min="0"
                value={overseasCredit}
                // (수정!) Number() 제거
                onChange={(e) => setOverseasCredit(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fieldPracticeCredit">현장실습 학점</label>
              <input
                type="number"
                id="fieldPracticeCredit"
                className="form-input"
                min="0"
                value={fieldPracticeCredit}
                // (수정!) Number() 제거
                onChange={(e) => setFieldPracticeCredit(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 py-2 px-4 font-medium text-gray-800 hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80"
            >
              {isEditMode ? '수정하기' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomLectureModal;