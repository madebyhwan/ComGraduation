const allRules = require('../config/graduationRules.js');
const majorCourses = require('../config/majorCourses.json');
const ventureCourses = require('../config/ventureCourses.json');

/**
 * 학생의 수강 과목들을 '전공', '교양', '일반선택'으로 분류하고 학점을 계산
 */
function classifyAndSumCredits(takenLectures, userCustomLectures, userDepartment) {
  let majorCredits = 0;             // 전공
  let generalEducationCredits = 0;  // 교양
  let generalElectiveCredits = 0;   // 일반 선택
  let startupCourseCredits = 0;     // 창업 교과목
  let fieldPracticeCredits = 0;     // 현장실습
  let overseasCredits = 0;          // 해외대학인정학점

  const ourMajorCourseList = majorCourses[userDepartment] || [];
  const ventureCourseList = ventureCourses["ventures"];

  takenLectures.forEach(lecture => {
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

  userCustomLectures.forEach(lecture => {
    const credit = Number(lecture.totalCredits) || 0;
    if (lecture.lectType === '교양') {
      generalEducationCredits += credit;
    } else if (lecture.lectType === '전공') {
      majorCredits += credit;
    } else {
      generalElectiveCredits += credit;
    }

    const fieldPracticeCredit = Number(lecture.fieldPracticeCredit) || 0;
    if (lecture.fieldPracticeCredit > 0) {
      fieldPracticeCredits += fieldPracticeCredit;
    }
    const overseasCredit = Number(lecture.overseasCredit) || 0;
    if (lecture.overseasCredit > 0) {
      overseasCredits += overseasCredit;
    }
  });

  // 계산된 모든 학점을 반환합니다.
  return {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    startupCourseCredits,
    fieldPracticeCredits,
    overseasCredits
  };
}

/**
 * 영어 성적 요건 충족 여부를 확인합니다.
 * 스키마: user.englishTest = { testType: String, score: String }
 */
function checkEnglishProficiency(user, rule) {
  if (!rule || !rule.options || !user.englishTest || !user.englishTest.testType || !user.englishTest.score) {
    return false; // 규칙이나 사용자 성적 정보가 없으면 미충족
  }

  const userTestType = user.englishTest.testType;
  let userScore = user.englishTest.score;

  // OPIC 레벨 매핑을 위한 배열
  const opicHierarchy = ['IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL'];

  for (const option of rule.options) {
    if (option.test === userTestType) {
      if (option.test === 'OPIC') {
        // OPIC 레벨 비교
        const userLevelIndex = opicHierarchy.indexOf(userScore);
        const requiredLevelIndex = opicHierarchy.indexOf(option.minLevel);
        if (userLevelIndex !== -1 && requiredLevelIndex !== -1 && userLevelIndex >= requiredLevelIndex) {
          return true;
        }
      } else {
        // 숫자 점수 비교 (문자열 점수를 숫자로 변환)
        const scoreNumber = Number(userScore);
        if (!isNaN(scoreNumber) && scoreNumber >= option.minScore) {
          return true;
        }
      }
    }
  }
  return false;
}

// --- 메인 체크 함수 ---

/**
 * 학생의 졸업 요건 충족 여부를 판별하는 메인 함수
 */
function check(user, takenLectures, userCustomLectures) {
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
    startupCourseCredits,
    fieldPracticeCredits,
    overseasCredits
  } = classifyAndSumCredits(takenLectures, userCustomLectures, user.userDepartment);

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
    // 스키마의 counselingCount 필드 사용
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
  if (requirements.internshipRequirement && requirements.internshipRequirement.minInternshipCredits) {
    const requiredCredits = requirements.internshipRequirement.minInternshipCredits;
    results.internship = {
      pass: fieldPracticeCredits >= requiredCredits,
      current: fieldPracticeCredits,
      required: requiredCredits,
      note: requirements.internshipRequirement.note || `현장실습 학점 ${requiredCredits}학점 이상 이수`
    };
  }

  // 해외대학인정학점
  if (requirements.globalCompetency && requirements.globalCompetency.minOverseasCredits) {
    const requiredCredits = requirements.globalCompetency.minOverseasCredits;
    results.globalCompetency = {
      pass: overseasCredits >= requiredCredits,
      current: overseasCredits,
      required: requiredCredits,
      note: `해외 이수 학점 ${requiredCredits}학점 이상 이수`
    };
  }

  const startupRule = requirements.ventureCourseCompetency;

  if (startupRule) {
    let passedStartupCourse = false;
    let requiredCourseCredits = 0;

    // 2. 창업 교과 요건 확인
    const courseRule = startupRule.options.find(opt => opt.type === 'venture_course');
    const userFoundedStartup = user.isStartup || false;


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