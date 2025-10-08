const allRules = require('../config/graduationRules.js');
const majorCourses = require('../config/majorCourses.json');

// --- 헬퍼 함수들 ---

/**
 * 학생의 수강 과목들을 '전공', '교양', '일반선택'으로 분류하고 학점을 계산합니다.
 */
function classifyAndSumCredits(lectures, userDepartment) {
  let majorCredits = 0;
  let generalEducationCredits = 0;
  let generalElectiveCredits = 0;
  const ourMajorCourseList = majorCourses[userDepartment] || [];

  lectures.forEach(lecture => {
    if (lecture.lectGeneral === '교양') {
      generalEducationCredits += lecture.credits;
    } else if (ourMajorCourseList.includes(lecture.lectCode)) {
      majorCredits += lecture.credits;
    } else {
      generalElectiveCredits += lecture.credits;
    }
  });

  return { majorCredits, generalEducationCredits, generalElectiveCredits };
}

/**
 * 영어 성적 요건 충족 여부를 확인합니다.
 */
function checkEnglishProficiency(user, rule) {
  if (!rule || !rule.options) return true; // 규칙이 없으면 통과

  for (const option of rule.options) {
    switch (option.test) {
      case 'TOEIC':
        if ((user.toeicScore || 0) >= option.minScore) return true;
        break;
      case 'TOEFL_IBT':
        if ((user.toeflIbtScore || 0) >= option.minScore) return true;
        break;
      case 'TEPS':
        if ((user.tepsScore || 0) >= option.minScore) return true;
        break;
      case 'OPIC':
        const opicHierarchy = ['IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL'];
        const userLevelIndex = opicHierarchy.indexOf(user.opicLevel);
        const requiredLevelIndex = opicHierarchy.indexOf(option.minLevel);
        if (userLevelIndex !== -1 && userLevelIndex >= requiredLevelIndex) return true;
        break;
      // ... 기타 영어 시험 case 추가 ...
    }
  }
  return false;
}

// --- 메인 체크 함수 ---

/**
 * 학생의 졸업 요건 충족 여부를 판별하는 메인 함수
 */
function check(user, takenLectures) {
  const ruleKey = `${user.userDepartment}_${user.userTrack}_${user.userYear}`;
  const requirements = allRules[ruleKey];

  if (!requirements) {
    throw new Error(`'${ruleKey}'에 해당하는 졸업요건 기준을 찾을 수 없습니다.`);
  }

  const results = {};

  // 1. 학점 계산 및 요건 판별
  const { majorCredits, generalEducationCredits, generalElectiveCredits } = classifyAndSumCredits(takenLectures, user.userDepartment);
  
  const geRule = requirements.generalEducationCredits;
  results.generalEducationCredits = {
    pass: generalEducationCredits >= geRule.min,
    current: generalEducationCredits,
    required: `${geRule.min} ~ ${geRule.max}`,
  };

  let recognizedGeCredits = Math.min(generalEducationCredits, geRule.max || Infinity);
  const recognizedTotalCredits = majorCredits + recognizedGeCredits + generalElectiveCredits;
  results.totalCredits = {
    pass: recognizedTotalCredits >= requirements.minTotalCredits,
    current: recognizedTotalCredits,
    required: requirements.minTotalCredits,
    note: `교양 학점은 최대 ${geRule.max}학점까지만 반영됩니다.`
  };
  
  results.majorCredits = {
    pass: majorCredits >= requirements.minMajorCredits.credits,
    current: majorCredits,
    required: requirements.minMajorCredits.credits,
  };

  // 2. 학점 외 기타 요건 판별
  const takenCourseCodes = takenLectures.map(lec => lec.lectCode);
  const missingCourses = requirements.requiredMajorCourses.courses.filter(reqCode => !takenCourseCodes.includes(reqCode));
  results.requiredMajorCourses = {
    pass: missingCourses.length === 0,
    required: requirements.requiredMajorCourses.courses,
    missing: missingCourses,
  };

  results.counselingSessions = {
    pass: (user.counselingCount || 0) >= requirements.counselingSessions.minRequired,
    current: user.counselingCount || 0,
    required: requirements.counselingSessions.minRequired,
  };

  results.exitRequirement = {
    pass: (user.passedTopcit || false) || (user.passedInterview || false),
    note: requirements.exitRequirement.note,
  };

  results.englishProficiency = {
    pass: checkEnglishProficiency(user, requirements.englishProficiency),
    note: requirements.englishProficiency.note,
  };

  // --- 최종 판별 ---
  const isEligible = Object.values(results).every(result => result.pass);

  return {
    eligible: isEligible,
    checkedAt: new Date().toISOString(),
    details: results,
  };
}

module.exports = {
  check
};