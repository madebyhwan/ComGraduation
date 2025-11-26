import React, { useState, useEffect } from 'react';
import { getGraduationStatus } from '../api/api.js';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// --- 요건 아이템 컴포넌트 ---
const RequirementItem = ({ title, result }) => {
  if (!result) return null;

  // 1. "영어 성적" 항목 전용 렌더링
  if (title === "영어 성적") {
    const { pass, testType, currentScore, requiredScore, note } = result;

    return (
      <div className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
        <div className="shrink-0 mt-0.5">
          {pass ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-gray-900 break-keep">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {currentScore !== '성적 미입력' && testType !== '미지정' ? (
              <>
                <span className="font-medium text-gray-800">{testType}: </span>
                <span className="font-medium">{currentScore}</span>
                <span className="text-gray-500"> / {requiredScore}</span>
              </>
            ) : (
              <span className="font-medium text-gray-500">{requiredScore}</span>
            )}
          </p>
          {note && !pass && (
            <p className="text-xs text-gray-500 mt-1 break-keep">{note}</p>
          )}
        </div>
      </div>
    );
  }

  // 2. "창업 교과" 항목 전용 렌더링
  if (title === "창업 교과" && result.details && result.details.startupCourse) {
    const { pass, note, details } = result;
    const { current, required } = details.startupCourse;
    return (
      <div className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
        <div className="shrink-0 mt-0.5">
          {pass ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-gray-900 break-keep">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">{current}</span>
            <span className="text-gray-500"> / {required}</span>
          </p>
          {note && !pass && (
            <p className="text-xs text-gray-500 mt-1 break-keep">{note}</p>
          )}
        </div>
      </div>
    );
  }

  // 3. 일반 항목 렌더링
  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
      <div className="shrink-0 mt-0.5">
        {result.pass ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-gray-900 break-keep">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">
          {result.current !== undefined && (
            <span className="font-medium">{result.current}</span>
          )}
          {result.required !== undefined && (
            <span className="text-gray-500">
              {/* required가 단순 숫자면 /를 붙이고, 문자열이면 그대로 출력하거나 상황에 맞게 조정 */}
              {' / '}
              {Array.isArray(result.required) ? result.required.join(', ') : result.required}
            </span>
          )}
        </p>
        {result.missing && result.missing.length > 0 && (
          <p className="text-xs text-red-500 mt-1 break-keep">
            (미이수: {result.missing.join(', ')})
          </p>
        )}
        {/* note가 있으면 pass 여부와 상관없이 중요 정보(예: 교양학점 상한선)일 수 있으므로 표시할 수도 있지만, 
            보통은 실패시 혹은 경고성으로 보여줍니다. 여기선 기존 로직 유지하되 note가 있으면 보여줌 */}
        {result.note && (
          <p className={`text-xs mt-1 break-keep ${!result.pass ? 'text-red-500' : 'text-gray-500'}`}>
            {result.note}
          </p>
        )}
      </div>
    </div>
  );
};

// --- Main 페이지 ---
const Main = () => {
  const [status, setStatus] = useState(null);
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
    return <div className="text-center p-10 text-gray-600">졸업 요건을 불러오는 중입니다...</div>;
  }

  if (!status) {
    return <div className="text-center p-10 text-red-600">졸업 요건 정보를 불러오지 못했습니다.</div>;
  }

  const { details, creditSummary } = status;

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-[1.6rem] md:text-3xl font-bold mb-6">졸업 자가 진단</h1>
        <div
          className={`px-4 py-2 rounded-lg font-semibold text-sm md:text-base whitespace-nowrap
            ${status.eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {status.eligible ? '졸업 가능' : '졸업 불가능'}
        </div>
      </div>

      {/* 면책 조항 */}
      <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-900 shadow-sm">
        <AlertTriangle className="w-4 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed break-keep">
          <span className="font-bold"></span> 본 자가 진단 서비스는 참고용이며, 실제 졸업 사정과 상이할 수 있습니다.
          시스템 오류나 데이터 누락으로 인한 불이익에 대해 책임지지 않으므로,
          <span className="font-semibold underline underline-offset-2 ml-1">반드시 학과 사무실이나 학교 포털을 통해 최종 확인하시기 바랍니다.</span>
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">학점 요건</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <RequirementItem title="총 이수 학점" result={details.totalCredits} />
        <RequirementItem title="전공 학점" result={details.majorCredits} />
        <RequirementItem title="교양 학점" result={details.generalEducationCredits} />

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

      {(details.knuBasicRequirement || details.knuCoreRequirement) && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">첨성인 기초/핵심</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 1. 첨성인 기초 그룹 */}
            {details.knuBasicRequirement && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                <div className="bg-slate-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    첨성인 기초
                  </h3>
                </div>
                <div className="p-5 space-y-3 flex-1">
                  <RequirementItem
                    title="독서와토론·사고교육·글쓰기·외국어"
                    result={details.knuBasicRequirement.readingDebate}
                  />
                  <RequirementItem
                    title="수리·기초과학"
                    result={details.knuBasicRequirement.mathScience}
                  />
                </div>
              </div>
            )}

            {/* 2. 첨성인 핵심 그룹 */}
            {details.knuCoreRequirement && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                <div className="bg-slate-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    첨성인 핵심
                  </h3>
                </div>
                <div className="p-5 space-y-3 flex-1">
                  <RequirementItem
                    title="인문·사회"
                    result={details.knuCoreRequirement.humanitySociety}
                  />
                  <RequirementItem
                    title="자연·과학"
                    result={details.knuCoreRequirement.naturalScience}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">기타 요건</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <RequirementItem title="전공 필수 과목" result={details.requiredMajorCourses} />
        <RequirementItem title="지도 교수 상담" result={details.counselingSessions} />

        {details.sdgRequirement && (
          <RequirementItem
            title="SDG 교양"
            result={details.sdgRequirement}
          />
        )}

        <RequirementItem title="졸업 자격 인정" result={details.exitRequirement} />
        <RequirementItem title="영어 성적" result={details.englishProficiency} />

        {details.capstoneDesignRequirement && (
          <RequirementItem
            title={
              details.capstoneDesignRequirement.required &&
                String(details.capstoneDesignRequirement.required).includes('학점')
                ? "설계 학점"
                : "종합 설계"
            }
            result={details.capstoneDesignRequirement}
          />
        )}

        <RequirementItem title="현장 실습" result={details.internship} />
        <RequirementItem title="해외 대학" result={details.globalCompetency} />
        {details.globalDegreeRequirement && (
          <RequirementItem title="해외 학위 요건" result={details.globalDegreeRequirement} />
        )}
        <RequirementItem title="창업 교과" result={details.ventureCourseCompetency} />
      </div>

      {creditSummary?.multiMajorCredits !== undefined && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">참고 사항</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
              <div className="shrink-0 mt-0.5">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-800 break-keep">다중전공 이수학점</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-gray-900">{creditSummary.multiMajorCredits}</span>
                  <span className="text-gray-500"> 학점</span>
                </p>
                <p className="text-xs text-red-500 mt-2 font-bold break-keep">
                  * 본인의 다중전공 유형 학점 요건을 모두 충족하였는지 반드시 확인하시기 바랍니다.
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