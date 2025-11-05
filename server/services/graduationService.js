const allRules = require('../config/graduationRules.js');
const majorCourses = require('../config/majorCourses.json');
const ventureCourses = require('../config/ventureCourses.json');


// --- 헬퍼 함수들 ---

/**
 * 학생의 수강 과목들을 '전공', '교양', '일반선택'으로 분류하고 학점을 계산합니다.
 */
function classifyAndSumCredits(lectures, userDepartment) {
  let majorCredits = 0;             // 전공
  let generalEducationCredits = 0;  // 교양
  let generalElectiveCredits = 0;   // 일반 선택
  let startupCourseCredits = 0;     // 창업 교과목

  const ourMajorCourseList = majorCourses[userDepartment] || [];
  const ventureCourseList = ventureCourses["ventures"];

  lectures.forEach(lecture => {
    const credits = Number(lecture.lectCredit) || 0;
    // 1. 주 학점 분류 (졸업 총 학점 계산용)
    if (lecture.lectGeneral === '교양') {
      generalEducationCredits += credits;
    } else if (ourMajorCourseList.includes(lecture.lectCode)) {
      majorCredits += credits;
    } else {
      generalElectiveCredits += credits;
    }

    // 창업 교과목
    if (ventureCourseList.includes(lecture.lectCode)) {
      startupCourseCredits += credits;
    }
  });

  // ⭐ 4. [변경] 계산된 모든 학점을 반환합니다.
  return {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    startupCourseCredits,
  };
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
  const {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    startupCourseCredits, // 계산된 창업 교과 학점
  } = classifyAndSumCredits(takenLectures, user.userDepartment);

  // 교양 학점
  const geRule = requirements.generalEducationCredits;
  results.generalEducationCredits = {
    pass: generalEducationCredits >= geRule.min,
    current: generalEducationCredits,
    required: `${geRule.min} ~ ${geRule.max}`,
  };

  // 총 학점
  let recognizedGeCredits = Math.min(generalEducationCredits, geRule.max || Infinity);
  const recognizedTotalCredits = majorCredits + recognizedGeCredits + generalElectiveCredits;
  results.totalCredits = {
    pass: recognizedTotalCredits >= requirements.minTotalCredits,
    current: recognizedTotalCredits,
    required: requirements.minTotalCredits,
    note: `교양 학점은 최대 ${geRule.max}학점까지만 반영됩니다.`
  };

  // 전공 학점
  results.majorCredits = {
    pass: majorCredits >= requirements.minMajorCredits.credits,
    current: majorCredits,
    required: requirements.minMajorCredits.credits,
  };

  // 2. 학점 외 기타 요건 판별

  // 전공 필수
  const takenCourseCodes = takenLectures.map(lec => lec.lectCode);
  const missingCourses = requirements.requiredMajorCourses.courses.filter(reqCode => !takenCourseCodes.includes(reqCode));
  results.requiredMajorCourses = {
    pass: missingCourses.length === 0,
    required: requirements.requiredMajorCourses.courses,
    missing: missingCourses,
  };

  // 지도 교수 상담
  results.counselingSessions = {
    pass: (user.counselingCount || 0) >= requirements.counselingSessions.minRequired,
    current: user.counselingCount || 0,
    required: requirements.counselingSessions.minRequired,
  };

  // TOPCIT or 졸업인터뷰
  results.exitRequirement = {
    pass: (user.passedTopcit || false) || (user.passedInterview || false),
    note: requirements.exitRequirement.note,
  };

  // 영어성적
  results.englishProficiency = {
    pass: checkEnglishProficiency(user, requirements.englishProficiency),
    note: requirements.englishProficiency.note,
  };

  // 현장실습
  if (requirements.internshipRequirement) {
    results.internship = {
      pass: (user.completedInternship || false),
      current: (user.completedInternship || false),
      required: requirements.internshipRequirement.required,
      note: requirements.internshipRequirement.note
    };
  }

  const startupRule = requirements.ventureCourseCompetency;

  if (startupRule) {
    let passedStartupCourse = false;
    let requiredCourseCredits = 0;

    // 2. 창업 교과 요건 확인
    const courseRule = startupRule.options.find(opt => opt.type === 'venture_course');
    const userFoundedStartup = user.startupFounded || false;

    if (courseRule) {
      if (!userFoundedStartup && courseRule.alternative && courseRule.alternative.condition === 'if_not_startup_founded') {
        requiredCourseCredits = courseRule.alternative.requiredCredits;
      } else {
        requiredCourseCredits = courseRule.baseCredits;
      }

      if (startupCourseCredits >= requiredCourseCredits) {
        passedStartupCourse = true;
      }
    }

    results.ventureCourseCompetency = {
      pass: passedStartupCourse,
      note: startupRule.note,
      details: {
        startupCourse: { pass: passedStartupCourse, current: startupCourseCredits, required: requiredCourseCredits }
      }
    };
  }

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