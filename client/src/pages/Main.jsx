import React, { useState, useEffect } from 'react';
import { getGraduationStatus } from '../api/api.js'; // (api.js에 만든 함수)
import { CheckCircle2, AlertCircle } from 'lucide-react'; // 아이콘

// --- 요건 아이템 컴포넌트 (서버 결과 표시용) ---
const RequirementItem = ({ title, result }) => {
  if (!result) return null; // 결과가 없으면 렌더링 안 함

  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg">
      {result.pass ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
      )}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">
          {/* 예: current: 110 */}
          {result.current !== undefined && (
            <span className="font-medium">{result.current}</span>
          )}
          {/* 예: required: 130 또는 ['과목1', '과목2'] */}
          {result.required !== undefined && (
            <span className="text-gray-500">
              {' / '}
              {/* --- (수정!) 'required'가 배열인지 확인 --- */}
              {Array.isArray(result.required)
                ? result.required.join(', ') // 배열이면 쉼표로 연결
                : result.required}
            </span>
          )}
        </p>
        {/* 예: (미이수: 과목3, 과목4) */}
        {result.missing && result.missing.length > 0 && (
          <p className="text-xs text-red-500 mt-1">
            (미이수: {result.missing.join(', ')})
          </p>
        )}
        {/* 예: 교양 학점은 최대 42학점... */}
        {result.note && (
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
        // 서버가 모든 계산을 수행합니다.
        const data = await getGraduationStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch graduation status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraduationStatus();
  }, []); // 처음 로드될 때 한 번만

  if (loading) {
    return <div className="text-center p-10">졸업 요건을 계산 중입니다...</div>;
  }

  if (!status) {
    return <div className="text-center p-10 text-red-600">졸업 요건 정보를 불러오는 데 실패했습니다.</div>;
  }

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
        {/* 서버가 보낸 graduationService.js의 결과(status.details)를
                  직접 RequirementItem에 전달합니다.
                */}
        <RequirementItem title="총 이수 학점" result={status.details.totalCredits} />
        <RequirementItem title="전공 학점" result={status.details.majorCredits} />
        <RequirementItem title="교양 학점" result={status.details.generalEducationCredits} />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">기타 요건</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RequirementItem title="전공 필수 과목" result={status.details.requiredMajorCourses} />
        <RequirementItem title="지도 교수 상담" result={status.details.counselingSessions} />
        <RequirementItem title="TOPCIT/졸업인터뷰" result={status.details.exitRequirement} />
        <RequirementItem title="영어 성적" result={status.details.englishProficiency} />

        {/* (서버 응답에 이 항목들이 포함된 경우에만 렌더링됩니다) */}
        <RequirementItem title="현장 실습" result={status.details.internship} />
        <RequirementItem title="해외 대학" result={status.details.globalCompetency} />
        <RequirementItem title="창업 교과" result={status.details.ventureCourseCompetency} />
      </div>
    </div>
  );
};

export default Main;