import React, { useState } from 'react';
import { searchLectures, addUnivLecture } from '../api/api.js';
import { PlusCircle } from 'lucide-react';

const LecSearch = ({ onLectureAdded }) => { 
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
        year: year || undefined, 
        semester: semester || undefined
      });

      if (data.message) { 
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAdd = async (lectureId) => {
    try {
      await addUnivLecture(lectureId);
      alert('강의가 추가되었습니다.');
      if (onLectureAdded) onLectureAdded(); 
    } catch (error) {
      alert(error.response?.data?.message || '강의 추가에 실패했습니다.');
    }
  };

  // 공통 input 스타일 (높이 h-12로 통일)
  const inputBaseClass = "rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12";

  return (
    <div className="p-6 bg-white rounded-lg border shadow-sm">
      <h3 className="text-xl font-semibold mb-4">강의계획서 검색</h3>
      
      {/* [수정] Flex 레이아웃 사용: 연도/학기는 좁게(w-32), 입력창은 넓게(flex-1) */}
      <div className="flex flex-col md:flex-row gap-2 mb-3">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={`${inputBaseClass} w-full md:w-32`} // 가로 길이 줄임 (약 128px)
        >
          <option value="">전체 연도</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className={`${inputBaseClass} w-full md:w-32`} // 가로 길이 줄임 (약 128px)
        >
          <option value="">전체 학기</option>
          <option value="1학기">1학기</option>
          <option value="2학기">2학기</option>
          <option value="계절학기(하계)">계절학기(하계)</option>
          <option value="계절학기(동계)">계절학기(동계)</option>
        </select>

        <input
          type="text"
          placeholder="강의명 또는 교수명 또는 과목코드로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`${inputBaseClass} flex-1`} // 남은 공간 꽉 채움
        />
      </div>
      
      {/* 검색 버튼 (높이 h-12로 통일) */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full h-12 rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80 disabled:bg-gray-400 transition-colors"
      >
        {loading ? '검색 중...' : '검색'}
      </button>

      {/* 검색 결과 */}
      <div className="mt-6 max-h-60 overflow-y-auto border-t border-gray-100 pt-2">
        {message && <p className="text-center text-gray-500 py-4">{message}</p>}
        <ul className="divide-y divide-gray-200">
          {results.map((lec) => (
            <li key={lec._id} className="flex items-center justify-between p-3 hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">{lec.lectName} <span className="text-gray-500 text-sm font-normal">({lec.lectCode})</span></p>
                <p className="text-sm text-gray-600 mt-1">
                  {lec.lectProfessor} | {lec.lectYear}년 {lec.lectSemester} | <span className="font-medium text-knu-blue">{lec.lectCredit}학점</span>
                </p>
              </div>
              <button
                onClick={() => handleAdd(lec._id)}
                title="추가하기"
                className="text-knu-blue hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
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