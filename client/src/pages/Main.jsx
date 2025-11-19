import React, { useState, useEffect } from 'react';
import { getGraduationStatus } from '../api/api.js'; // (api.js에 만든 함수)
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'; // 아이콘

// --- 요건 아이템 컴포넌트 (서버 결과 표시용) ---
const RequirementItem = ({ title, result }) => {
  if (!result) return null; // 결과가 없으면 렌더링 안 함

  // 1. "영어 성적" 항목을 위한 전용 렌더링
  if (title === "영어 성적") {
    const { pass, testType, currentScore, requiredScore, note } = result;

    return (
      <div className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
        {pass ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        )}
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-gray-600">
            {currentScore !== '성적 미입력' && testType !== '미지정' ? (
              <>
                <span className="font-medium text-gray-800">{testType}: </span>
                <span className="font-medium">{currentScore}</span>
                <span className="text-gray-500"> / {requiredScore}</span>
              </>
            ) : (
              <br />
            )}
          </p>
          {note && !pass && ( // 통과 시 note 숨김 처리
            <p className="text-xs text-gray-500 mt-1">{note}</p>
          )}
        </div>
      </div>
    );
  }

  // 2. "창업 교과" 항목을 위한 전용 렌더링
  if (title === "창업 교과" && result.details && result.details.startupCourse) {
    const { pass, note, details } = result;
    const { current, required } = details.startupCourse;

    return (
      <div className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
        {pass ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        )}
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{current}</span>
            <span className="text-gray-500"> / {required}</span>
          </p>
          {note && !pass && ( // 통과 시 note 숨김 처리
            <p className="text-xs text-gray-500 mt-1">{note}</p>
          )}
        </div>
      </div>
    );
  }

  // 3. 모든 일반 항목 렌더링 (총 학점, 전공 학점, 교양 학점, ABEEK 세부 학점 등)
  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
      {result.pass ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
      )}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">
          {result.current !== undefined && (
            <span className="font-medium">{result.current}</span>
          )}
          {result.required !== undefined && (
            <span className="text-gray-500">
              {' / '}
              {Array.isArray(result.required)
                ? result.required.join(', ') // 배열이면 쉼표로 연결
                : result.required}
            </span>
          )}
        </p>
        {result.missing && result.missing.length > 0 && (
          <p className="text-xs text-red-500 mt-1">
            (미이수: {result.missing.join(', ')})
          </p>
        )}
        {result.note && !result.pass && ( // 통과 시 note 숨김 처리
          <p className="text-xs text-gray-500 mt-1">{result.note}</p>
        )}
      </div>
    </div>
  );
};

// --- Main 페이지 (대시보드) ---
const Main = () => {
  const [status, setStatus] = useState(null); // 서버 응답 전체
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraduationStatus = async () => {
      try {
        const data = await getGraduationStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch graduation status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraduationStatus();
  }, []);

  if (loading) {
    return <div className="text-center p-10">졸업 요건을 계산 중입니다...</div>;
  }

  if (!status) {
    return <div className="text-center p-10 text-red-600">졸업 요건 정보를 불러오는 데 실패했습니다.</div>;
  }

  const summary = status.creditSummary;
  const details = status.details;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">졸업 자가 진단</h1>
        <div
          className={`px-4 py-2 rounded-lg font-semibold
            ${status.eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {status.eligible ? '졸업 가능' : '졸업 불가능'}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">학점 요건</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 공통 학점 요건 */}
        <RequirementItem title="총 이수 학점" result={details.totalCredits} />
        <RequirementItem title="전공 학점" result={details.majorCredits} />
        <RequirementItem title="교양 학점" result={details.generalEducationCredits} />

        {/* 🎯 ABEEK 세부 학점 요건 (심컴 전용: 필드 존재 시에만 렌더링) */}
        {details.basicGeneralEducationCredits && (
          <RequirementItem title="기본소양 학점" result={details.basicGeneralEducationCredits} />
        )}
        {details.majorBasisCredits && (
          <RequirementItem title="전공기반 학점" result={details.majorBasisCredits} />
        )}
        {details.engineeringMajorCredits && (
          <RequirementItem title="공학전공 학점" result={details.engineeringMajorCredits} />
        )}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">기타 요건</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RequirementItem title="전공 필수 과목" result={details.requiredMajorCourses} />
        <RequirementItem title="지도 교수 상담" result={details.counselingSessions} />
        <RequirementItem title="TOPCIT/졸업인터뷰" result={details.exitRequirement} />
        <RequirementItem title="영어 성적" result={details.englishProficiency} />

        {/* 설계 학점은 minDesignCredits이 있을 때 별도 항목으로 출력 */}
        {details.capstoneDesignRequirement?.minDesignCredits !== undefined && (
          <RequirementItem title="설계 학점" result={details.capstoneDesignRequirement} />
        )}

        {/* Capstone Design이 options 형태일 때만 (글로벌SW융합전공) */}
        {details.capstoneDesignRequirement?.options && details.capstoneDesignRequirement?.minDesignCredits === undefined && (
          <RequirementItem title="종합 설계" result={details.capstoneDesignRequirement} />
        )}

        {/* (서버 응답에 이 항목들이 포함된 경우에만 렌더링됩니다) */}
        <RequirementItem title="현장 실습" result={details.internship} />
        <RequirementItem title="해외 대학" result={details.globalCompetency} />
        <RequirementItem title="창업 교과" result={details.ventureCourseCompetency} />
      </div>

      {/* 3. 참고사항 섹션 (다중전공 학점) */}
      {summary?.multiMajorCredits !== undefined && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">참고 사항</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800">다중전공 이수학점</h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{summary.multiMajorCredits || 0}</span>
                  <span className="text-gray-500"> 학점</span>
                </p>
                <p className="text-xs text-red-500 mt-1 font-bold">
                  * 본인의 다중전공 유형 학점 요건을 모두 충족하였는지<br></br>  반드시 확인하시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Main;