import React, { useState } from 'react';
import { searchLectures, addUnivLecture } from '../api/api.js';
import { PlusCircle } from 'lucide-react';

const LecSearch = ({ onLectureAdded }) => { // 과목 추가 성공 시 부모에게 알림
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!keyword) {
      setMessage('검색어를 입력하세요.');
      return;
    }
    setLoading(true);
    setMessage('');
    setResults([]);
    try {
      const data = await searchLectures({
        keyword,
        year: year || undefined, // 비어있으면 보내지 않음
        semester: semester || undefined
      });

      if (data.message) { // "검색된 강의가 없습니다."
        setMessage(data.message);
      } else if (data.length > 0) {
        setResults(data);
      } else {
        setMessage('검색된 강의가 없습니다.');
      }
    } catch (error) {
      setMessage('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // [추가] 엔터키 입력 감지 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAdd = async (lectureId) => {
    try {
      await addUnivLecture(lectureId);
      alert('강의가 추가되었습니다.');
      if (onLectureAdded) onLectureAdded(); // 부모 컴포넌트(CoursesPage)에 알림
    } catch (error) {
      alert(error.response?.data?.message || '강의 추가에 실패했습니다.');
    }
  };

return (
    <div className="p-6 bg-white rounded-lg border shadow-sm">
      <h3 className="text-xl font-semibold mb-4">강의계획서 검색</h3>
      
      {/* [수정] 입력 필드들을 위한 Grid 레이아웃 (버튼 제외) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        {/* 1. 연도 선택 */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="form-input"
        >
          <option value="">전체 연도</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>

        {/* 2. 학기 선택 */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="form-input"
        >
          <option value="">전체 학기</option>
          <option value="1학기">1학기</option>
          <option value="2학기">2학기</option>
          <option value="계절학기(하계)">계절학기(하계)</option>
          <option value="계절학기(동계)">계절학기(동계)</option>
        </select>

        {/* 3. 검색어 입력 (나머지 2칸 차지) */}
        <input
          type="text"
          placeholder="강의명 또는 교수명 또는 과목코드"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress} 
          className="form-input md:col-span-2"
        />
      </div>
      
      {/* [수정] 검색 버튼을 Grid 밖으로 빼서 하단에 전체 너비로 배치 */}
      <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80 disabled:bg-gray-400 transition-colors"
      >
          {loading ? '검색 중...' : '검색'}
      </button>

      {/* 검색 결과 */}
      <div className="mt-6 max-h-60 overflow-y-auto">
        {message && <p className="text-center text-gray-500">{message}</p>}
        <ul className="divide-y divide-gray-200">
          {results.map((lec) => (
            <li key={lec._id} className="flex items-center justify-between p-3">
              <div>
                <p className="font-semibold">{lec.lectName} ({lec.lectCode})</p>
                <p className="text-sm text-gray-600">
                  {lec.lectProfessor} | {lec.lectYear}년 {lec.lectSemester} | {lec.lectCredit}학점
                </p>
              </div>
              <button
                onClick={() => handleAdd(lec._id)}
                title="추가하기"
                className="text-knu-blue hover:text-blue-700"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LecSearch;