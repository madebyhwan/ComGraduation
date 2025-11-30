import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { searchLectures, addUnivLecture } from '../api/api.js';
import { PlusCircle } from 'lucide-react';

const getBadgeStyle = (category) => {
  if (!category) return 'bg-gray-100 text-gray-600 border-gray-200';

  const cat = category.trim();

  if (cat === '전공필수' || cat === '전필' || cat.includes('전공필수')) {
    return 'bg-pink-50 text-pink-600 border-pink-200';
  }
  if (cat.includes('전공') || cat.includes('공학')) {
    return 'bg-blue-50 text-blue-600 border-blue-200';
  }
  if (cat.includes('일반선택')) {
    return 'bg-purple-50 text-purple-600 border-purple-200';
  }
  if (cat.includes('교양') || cat.includes('기본소양') || cat.includes('교필') || cat.includes('교선')) {
    return 'bg-green-50 text-green-600 border-green-200';
  }
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

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
      toast.success('강의가 추가되었습니다.', {
        position: "top-right",
        autoClose: 3000
      });
      if (onLectureAdded) onLectureAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || '강의 추가에 실패했습니다.', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  // [복구] 기존 입력창 높이(h-12) 유지
  const inputBaseClass = "rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-knu-blue focus:border-transparent h-12";

  return (
    // 내부 패딩 p-4 유지 (너무 좁지 않게)
    <div className="p-4 bg-white rounded-lg border shadow-sm">
      <h3 className="text-xl font-semibold mb-4">강의계획서 검색</h3>

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
          <option value="2020">2020</option>
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
          placeholder="강의명 또는 교수명 또는 과목코드"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`${inputBaseClass} w-full md:flex-1`}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        // [복구] 버튼 높이(h-12) 유지
        className="w-full h-12 rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80 disabled:bg-gray-400 transition-colors"
      >
        {loading ? '검색 중...' : '검색'}
      </button>

      <div className="mt-6 max-h-60 overflow-y-auto border-t border-gray-100 pt-2 scrollbar-hide">
        {message && <p className="text-center text-gray-500 py-4 text-sm">{message}</p>}
        <ul className="divide-y divide-gray-200">
          {results.map((lec) => (
            <li key={lec._id} className="flex items-center justify-between p-3 hover:bg-gray-50">
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="font-semibold text-gray-800 break-keep leading-tight">
                    {lec.lectName}
                  </span>

                  <span className="text-gray-400 text-xs sm:text-sm font-normal whitespace-nowrap">
                    ({lec.lectCode})
                    {lec.lectDiv ? ` (${lec.lectDiv})` : ''}
                  </span>

                  {lec.lectGeneral && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 whitespace-nowrap ${getBadgeStyle(lec.lectGeneral)}`}>
                      {lec.lectGeneral}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                  <span className="mr-1">{lec.lectProfessor || '교수미정'}</span>
                  <span className="text-gray-300 mx-1">|</span>
                  <span className="mx-1">{lec.lectYear}-{lec.lectSemester}</span>
                  {lec.lectTime && (
                    <>
                      <span className="text-gray-300 mx-1">|</span>
                      <span className="mx-1">{lec.lectTime}</span>
                    </>
                  )}
                  <span className="text-gray-300 mx-1">|</span>
                  <span className="font-medium text-knu-blue">{lec.lectCredit}학점</span>
                </p>
                {lec.lectDepartment && (
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    개설: {lec.lectDepartment}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleAdd(lec._id)}
                title="추가하기"
                className="shrink-0 text-knu-blue hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
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