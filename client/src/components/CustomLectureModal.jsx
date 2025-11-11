import React, { useState } from 'react';
import './CustomLectureModal.css'; 

function CustomLectureModal({ onClose, onAdd }) {
  const [activity, setActivity] = useState({
    lectName: '',
    lectType: '', // [수정] '전공', '교양', '일반선택' 중 하나가 되어야 함
    overseasCredit: 0,
    fieldPracticeCredit: 0,
    totalCredit: 0, // [수정] lectCredit -> totalCredit로 변경
  });
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setActivity(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.lectName) {
      return alert('활동명을 입력해주세요.');
    }
    // [수정] '교과 구분'이 필수값이 되었습니다.
    if (!activity.lectType) {
      return alert('교과 구분을 선택해주세요.');
    }
    
    // 학점 필드를 숫자로 변환
    const payload = {
      ...activity,
      overseasCredit: Number(activity.overseasCredit) || 0,
      fieldPracticeCredit: Number(activity.fieldPracticeCredit) || 0,
      totalCredit: Number(activity.totalCredit) || 0,
    };

    setLoading(true);
    try {
      await onAdd(payload);
    } catch (error) {
      // 에러 처리는 Main.jsx의 핸들러가 담당
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2>기타 활동 추가</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="custom-lecture-form">
            <div className="info-row">
              <label>활동명</label>
              <input
                type="text"
                value={activity.lectName}
                onChange={(e) => update('lectName', e.target.value)}
                placeholder="예: 2025 하계 인도 인턴십"
                required
              />
            </div>
            
            {/* [수정] '교과 구분'을 text input에서 select dropdown으로 변경 */}
            <div className="info-row">
              <label>교과 구분</label>
              <select 
                value={activity.lectType} 
                onChange={(e) => update('lectType', e.target.value)}
                required
              >
                <option value="" disabled>교과 구분을 선택하세요</option>
                <option value="전공">전공</option>
                <option value="교양">교양</option>
                <option value="일반선택">일반선택</option>
              </select>
            </div>

            <div className="info-row">
              <label>해외인정학점</label>
              <input
                type="number"
                min="0"
                value={activity.overseasCredit}
                onChange={(e) => update('overseasCredit', e.target.value)}
              />
            </div>
            <div className="info-row">
              <label>현장실습학점</label>
              <input
                type="number"
                min="0"
                value={activity.fieldPracticeCredit}
                onChange={(e) => update('fieldPracticeCredit', e.target.value)}
              />
            </div>
            <div className="info-row">
              <label>총 이수학점에 포함되는 학점 (미포함 시 0 기입)</label>
              <input
                type="number"
                min="0"
                value={activity.totalCredit}
                onChange={(e) => update('totalCredit', e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="action-btn-gray" onClick={onClose}>취소</button>
              <button type="submit" className="action-btn" disabled={loading}>
                {loading ? '추가 중...' : '추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// [참고] CSS 파일에 <select> 스타일을 추가해야 할 수 있습니다.
// .modal-container .info-row select {
//   padding: 10px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   font-size: 15px;
//   width: 100%;
//   box-sizing: border-box;
// }

export default CustomLectureModal;