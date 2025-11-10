import React, { useState } from 'react';
import './CustomLectureModal.css'; 

function CustomLectureModal({ onClose, onAdd }) {
  const [activity, setActivity] = useState({
    lectName: '',
    lectType: '',
    overseasCredit: 0,
    fieldPracticeCredit: 0,
    totalCredit: 0,
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
                placeholder="예: 2024 하계 K-Digital"
                required
              />
            </div>
            <div className="info-row">
              <label>교과 구분</label>
              <input
                type="text"
                value={activity.lectType}
                onChange={(e) => update('lectType', e.target.value)}
                placeholder="예: 현장실습, 해외교류"
              />
            </div>
            <div className="info-row">
              <label>해외 인정 학점</label>
              <input
                type="number"
                min="0"
                value={activity.overseasCredit}
                onChange={(e) => update('overseasCredit', e.target.value)}
              />
            </div>
            <div className="info-row">
              <label>현장 실습 학점</label>
              <input
                type="number"
                min="0"
                value={activity.fieldPracticeCredit}
                onChange={(e) => update('fieldPracticeCredit', e.target.value)}
              />
            </div>
            <div className="info-row">
              <label>총 이수 학점 (포함)</label>
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
                {loading ? '추가 중...' : '추가하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomLectureModal;