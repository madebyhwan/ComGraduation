import React, { useState } from 'react';
import api from '../api/api'; 
import './LecSearch.css'; 

function LecSearch({ onClose, onAddLecture }) {
  const [filters, setFilters] = useState({ keyword: '', year: '', semester: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!filters.keyword) {
      return alert('검색어를 입력해주세요.');
    }
    setLoading(true);
    setMessage('');
    setResults([]);
    try {
      // [수정] 실제 API를 호출합니다.
      const response = await api.get('/api/lectures/search', {
        params: {
          keyword: filters.keyword,
          year: filters.year || undefined, // 값이 없으면 쿼리에서 제외
          semester: filters.semester || undefined,
        }
      });

      const data = response.data; // Axios 응답 데이터는 .data에 있습니다.
      
      // 서버 응답에 따라 결과 처리
      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        // 백엔드에서 "검색된 강의가 없습니다."와 같은 메시지를 보낼 경우
        setMessage(data.message || '검색된 강의가 없습니다.');
      }
    } catch (error) {
      // 4xx, 5xx 에러 처리
      const msg = error.response?.data?.message || '검색 중 오류가 발생했습니다.';
      setMessage(msg);
      console.error("강의 검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // [추가] 엔터 키 입력 감지 함수
  const handleKeyPress = (event) => {
    // 1. 눌린 키가 'Enter'인지 확인합니다.
    if (event.key === 'Enter') {
      // 2. form 태그 안에서 Enter를 누를 때 기본 동작(페이지 새로고침)을 방지합니다.
      event.preventDefault();
      // 3. '검색' 버튼을 누른 것과 동일하게 handleSearch 함수를 호출합니다.
      handleSearch();
    }
  };

  const yearOptions = [2021, 2022, 2023, 2024, 2025];
  const semesterOptions = ['1학기', '2학기', '계절학기(하계)', '계절학기(동계)'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>강의 검색</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <div className="search-filters">
            <select name="year" value={filters.year} onChange={handleFilterChange}>
              <option value="">전체 연도</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}년</option>)}
            </select>
            <select name="semester" value={filters.semester} onChange={handleFilterChange}>
              <option value="">전체 학기</option>
              {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="text"
              name="keyword"
              placeholder="강의명 또는 교수명 또는 과목코드로 검색"
              value={filters.keyword}
              onChange={handleFilterChange}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? '검색 중...' : '검색'}
            </button>
          </div>
          <div className="search-results">
            {message && !loading && <p className="message-text">{message}</p>}
            {results.length > 0 && (
              <table className="results-table">
                <thead>
                  <tr><th>교과목명</th><th>교과목코드</th><th>담당교수</th><th>분반</th><th>강의시간</th><th>학점</th><th>추가</th></tr>
                </thead>
                <tbody>
                  {results.map((lec) => (
                    <tr key={lec._id}> {/* DB의 고유 ID 사용 권장 */}
                      <td>{lec.lectName}</td><td>{lec.lectCode}</td><td>{lec.lectProfessor}</td><td>{lec.lectDiv}</td><td>{lec.lectTime}</td><td>{lec.lectCredit}</td>
                      <td><button onClick={() => onAddLecture(lec)} className="add-btn">추가</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LecSearch;