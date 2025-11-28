import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addCustomLecture, updateCustomLecture, getMyInfo } from '../api/api.js';

const CustomLectureModal = ({ show, onClose, onLectureAdded, lectureToEdit }) => {
  const isEditMode = !!lectureToEdit;

  const [lectName, setLectName] = useState('');
  const [lectType, setLectType] = useState('전공');
  // (수정!) 학점 필드도 빈 문자열("")을 허용하도록 초기값을 0 대신 ""로 설정
  const [overseasCredit, setOverseasCredit] = useState('');
  const [fieldPracticeCredit, setFieldPracticeCredit] = useState('');
  const [startupCourseCredit, setStartupCourseCredit] = useState('');
  const [totalCredit, setTotalCredit] = useState('');
  const [error, setError] = useState('');

  const [userDepartment, setUserDepartment] = useState('');
  const [additionalAttributes, setAdditionalAttributes] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getMyInfo();
        if (data.user) {
          setUserDepartment(data.user.userDepartment || '');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    if (show) {
      fetchUserInfo();
      // 모달이 열릴 때 body 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫힐 때 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    // cleanup: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  // 폼 데이터 로드 (edit/add 모드 분리)
  useEffect(() => {
    if (isEditMode && lectureToEdit) {
      // 수정할 강의 데이터로 폼 상태 설정 (null/undefined/0을 빈 문자열로)
      setLectName(lectureToEdit.lectName);
      setLectType(lectureToEdit.lectType);
      setOverseasCredit(lectureToEdit.overseasCredit || '');
      setFieldPracticeCredit(lectureToEdit.fieldPracticeCredit || '');
      setStartupCourseCredit(lectureToEdit.startupCourseCredit || '');
      setTotalCredit(lectureToEdit.totalCredit || '');
      // 추가속성 복원
      setAdditionalAttributes({
        knuBasicReading: lectureToEdit.knuBasicReading || false,
        knuBasicMath: lectureToEdit.knuBasicMath || false,
        knuCoreHumanity: lectureToEdit.knuCoreHumanity || false,
        knuCoreNatural: lectureToEdit.knuCoreNatural || false,
        isSDGLecture: lectureToEdit.isSDGLecture || false
      });
    } else if (!isEditMode) {
      // '추가 모드'일 때, 폼을 리셋합니다.
      setLectName('');
      setLectType('전공');
      setOverseasCredit('');
      setFieldPracticeCredit('');
      setStartupCourseCredit('');
      setTotalCredit('');
      setAdditionalAttributes({});
    }

    setError('');
  }, [lectureToEdit, isEditMode]);

  if (!show) {
    return null;
  }

  // 전공 구분 함수
  const isShinComMajor = () => {
    return userDepartment.includes('심화컴퓨터공학전공') ||
      userDepartment.includes('플랫폼SW&데이터과학전공');
  };

  const isGSOrACMajor = () => {
    return userDepartment.includes('글로벌SW융합전공') ||
      userDepartment.includes('인공지능컴퓨팅전공');
  };

  // 교과구분 옵션 동적 결정
  const getLectTypeOptions = () => {
    if (isShinComMajor()) {
      return [
        { value: '기본소양', label: '기본소양' },
        { value: '전공기반', label: '전공기반' },
        { value: '공학전공', label: '공학전공' },
        { value: '교양', label: '교양' },
        { value: '일반선택', label: '일반선택' }
      ];
    }
    // 글솝, 인컴, 기타는 원래 옵션
    return [
      { value: '전공', label: '전공' },
      { value: '교양', label: '교양' },
      { value: '일반선택', label: '일반선택' }
    ];
  };

  // 추가속성 옵션 (글솝, 인컴만)
  const getAdditionalAttributeOptions = () => {
    if (isGSOrACMajor()) {
      return [
        { id: 'knuBasicReading', label: '첨성인기초 - 독서와토론/사고교육/글쓰기/외국어' },
        { id: 'knuBasicMath', label: '첨성인기초 - 수리/기초과학' },
        { id: 'knuCoreHumanity', label: '첨성인핵심 - 인문/사회' },
        { id: 'knuCoreNatural', label: '첨성인핵심 - 자연/과학' },
        { id: 'isSDGLecture', label: 'SDG교양' }
      ];
    }
    return [];
  };

  const handleAttributeChange = (attributeId) => {
    setAdditionalAttributes(prev => ({
      ...prev,
      [attributeId]: !prev[attributeId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // (수정!) api.js가 || 0 처리를 해주므로, state 그대로 전송
    const lectureData = {
      lectName,
      lectType,
      overseasCredit,
      fieldPracticeCredit,
      startupCourseCredit,
      totalCredit,
      // 추가속성 포함
      knuBasicReading: additionalAttributes.knuBasicReading || false,
      knuBasicMath: additionalAttributes.knuBasicMath || false,
      knuCoreHumanity: additionalAttributes.knuCoreHumanity || false,
      knuCoreNatural: additionalAttributes.knuCoreNatural || false,
      isSDGLecture: additionalAttributes.isSDGLecture || false
    };

    try {
      if (isEditMode) {
        await updateCustomLecture(lectureToEdit._id, lectureData);
        toast.success('기타 활동이 수정되었습니다.', {
          position: "top-right",
          autoClose: 3000
        });
      } else {
        await addCustomLecture(lectureData);
        toast.success('기타 활동이 추가되었습니다.', {
          position: "top-right",
          autoClose: 3000
        });
      }

      if (onLectureAdded) onLectureAdded();
      onClose();

    } catch (error) {
      setError(error.response?.data?.message || "작업 중 오류 발생");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? '커스텀 과목 & 교과목 외 활동 수정' : '교과목 외 활동 추가'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          기존에 수강한 과목의 교과구분을 수정하거나 <br />강의계획서에 없는 교과목 외 활동(해외대학, 현장실습 등)을 관리합니다.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* ... 활동명, 교과구분 필드는 기존 유지 ... */}
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
              {getLectTypeOptions().map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* 학점 입력 필드들 (2열 그리드로 변경하여 공간 확보) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="totalCredit">총 학점</label>
              <input
                type="number"
                id="totalCredit"
                className="form-input"
                min="0"
                value={totalCredit}
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
                onChange={(e) => setFieldPracticeCredit(e.target.value)}
              />
            </div>
            {/* [추가] 창업 학점 입력 필드 */}
            <div className="form-group">
              <label className="form-label" htmlFor="startupCourseCredit">창업 학점</label>
              <input
                type="number"
                id="startupCourseCredit"
                className="form-input"
                min="0"
                value={startupCourseCredit}
                onChange={(e) => setStartupCourseCredit(e.target.value)}
              />
            </div>
          </div>

          {/* [추가] 추가속성 섹션 (글솝, 인컴만 표시) */}
          {getAdditionalAttributeOptions().length > 0 && (
            <div className="form-group border-t pt-4">
              <label className="form-label mb-3">추가속성</label>
              <div className="space-y-2">
                {getAdditionalAttributeOptions().map(attr => (
                  <label key={attr.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={additionalAttributes[attr.id] || false}
                      onChange={() => handleAttributeChange(attr.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{attr.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

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