const allRules = require('../config/graduationRules.js');
const majorCourses = require('../config/majorCourses.json');
const ventureCourses = require('../config/ventureCourses.json');
const abeekCourses = require('../config/abeekCourses.json'); // ABEEK 분류 데이터
const lectures = require('../models/lectures.js');

/**
 * [글로벌SW융합전공용] 학점 계산 함수
 * - 기존 로직 유지 (majorCourses.json 사용)
 * - 창업 교과목, 해외 대학 인정 학점 계산 포함
 */
function classifyAndSumCredits_GS(takenLectures, userCustomLectures, multiMajorLectures, userDepartment) {
  let majorCredits = 0;             // 전공
  let generalEducationCredits = 0;  // 교양
  let generalElectiveCredits = 0;   // 일반 선택
  let startupCourseCredits = 0;     // 창업 교과목
  let fieldPracticeCredits = 0;     // 현장실습
  let overseasCredits = 0;          // 해외대학인정학점
  let multiMajorCredits = 0;        // 다중전공

  const ourMajorCourseList = majorCourses[userDepartment] || [];
  const ventureCourseList = ventureCourses["ventures"];

  takenLectures.forEach(lecture => {
    const credits = Number(lecture.lectCredit) || 0;
    const isMajor = ourMajorCourseList.includes(lecture.lectCode) && lecture.lectDepartment.includes("컴퓨터학부");

    // 1. 주 학점 분류
    if (lecture.lectGeneral === '교양' || lecture.lectGeneral === '기본소양') {
      generalEducationCredits += credits;
    } else if (isMajor) {
      majorCredits += credits;
    } else {
      generalElectiveCredits += credits;
    }

    // 창업 교과목
    if (ventureCourseList.includes(lecture.lectCode)) {
      startupCourseCredits += credits;
    }
    // 해외 대학 (영어 강의 + 전공)
    if (isMajor && lecture.isEnglishLecture) {
      overseasCredits += 1;
    }
  });

  userCustomLectures.forEach(lecture => {
    const credit = Number(lecture.totalCredit) || 0;
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

  multiMajorLectures.forEach(lecture => {
    const credit = Number(lecture.lectCredit) || 0;
    multiMajorCredits += credit;
  });

  return {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    startupCourseCredits,
    fieldPracticeCredits,
    overseasCredits,
    multiMajorCredits
  };
}

/**
 * [심화컴퓨터공학전공용] 학점 계산 함수 (ABEEK)
 * - abeekCourses.json 사용
 * - 기본소양, 전공기반, 공학전공, 설계학점 세부 계산
 * - 창업, 해외대학 로직 제외
 */
function classifyAndSumCredits_SC(takenLectures, userCustomLectures, multiMajorLectures) {
  // 공통 학점
  let majorCredits = 0;
  let generalEducationCredits = 0;
  let generalElectiveCredits = 0;
  let fieldPracticeCredits = 0;
  let multiMajorCredits = 0;

  // ABEEK 세부 학점
  let basicGeneralEducationCredits = 0;
  let majorBasisCredits = 0;
  let engineeringMajorCredits = 0;
  let totalDesignCredits = 0;

  // 분류 리스트 로드
  const basicGenEdList = abeekCourses.basicGeneralEducation || [];
  const majorBasisList = abeekCourses.majorBasis || [];
  const engineeringMajorList = abeekCourses.engineeringMajor || [];
  const designCourseList = abeekCourses.designCourses || [];

  takenLectures.forEach(lecture => {
    const credits = Number(lecture.lectCredit) || 0;
    const courseCode = lecture.lectCode;

    // 1. ABEEK 세부 분류 (우선순위: 공학전공 > 전공기반 > 기본소양 > 일반교양)
    if (engineeringMajorList.includes(courseCode)) {
      engineeringMajorCredits += credits;
      majorCredits += credits;
    } else if (majorBasisList.includes(courseCode)) {
      majorBasisCredits += credits;
      majorCredits += credits;
    } else if (basicGenEdList.includes(courseCode)) {
      basicGeneralEducationCredits += credits;
      generalEducationCredits += credits;
    } else if (lecture.lectGeneral === '교양' || lecture.lectGeneral === '기본소양') {
      generalEducationCredits += credits;
    } else {
      generalElectiveCredits += credits;
    }

    // 2. 설계 학점 (독립적 합산)
    if (designCourseList.includes(courseCode)) {
      totalDesignCredits += credits;
    }
  });

  userCustomLectures.forEach(lecture => {
    const credit = Number(lecture.totalCredit) || 0;
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
    // 심화컴퓨터공학전공은 해외대학인정학점 로직 제외
  });

  multiMajorLectures.forEach(lecture => {
    const credit = Number(lecture.lectCredit) || 0;
    multiMajorCredits += credit;
  });

  return {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    fieldPracticeCredits,
    multiMajorCredits,
    // ABEEK 전용 반환값
    basicGeneralEducationCredits,
    majorBasisCredits,
    engineeringMajorCredits,
    totalDesignCredits
  };
}

/**
 * 영어 성적 요건 확인 함수
 */
function checkEnglishProficiency(user, rule) {
  const defaultResult = {
    pass: false,
    testType: '미지정',
    currentScore: '성적 미입력',
    requiredScore: '요건 확인 불가',
    allRequirements: '요건 확인 불가'
  };

  if (!rule || !rule.options) return defaultResult;

  const allReqText = rule.options.map(o => `${o.test} ${o.minScore || o.minLevel}`).join(' 또는 ');

  if (!user.englishTest || !user.englishTest.testType || !user.englishTest.score) {
    return {
      pass: false,
      testType: '미지정',
      currentScore: '성적 미입력',
      requiredScore: '기준 중 하나 충족 필요',
      allRequirements: allReqText
    };
  }

  const userTestType = user.englishTest.testType;
  const userScore = user.englishTest.score;
  const opicHierarchy = ['IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL'];

  const relevantRule = rule.options.find(option => option.test === userTestType);

  if (!relevantRule) {
    return {
      pass: false,
      testType: userTestType,
      currentScore: userScore,
      requiredScore: '해당 시험은 요건에 없음',
      allRequirements: allReqText
    };
  }

  let isPass = false;
  let requiredScoreText = '';

  if (relevantRule.test === 'OPIC') {
    requiredScoreText = relevantRule.minLevel;
    const userLevelIndex = opicHierarchy.indexOf(userScore);
    const requiredLevelIndex = opicHierarchy.indexOf(requiredScoreText);
    if (userLevelIndex !== -1 && requiredLevelIndex !== -1 && userLevelIndex >= requiredLevelIndex) {
      isPass = true;
    }
  } else {
    requiredScoreText = String(relevantRule.minScore);
    const scoreNumber = Number(userScore);
    if (!isNaN(scoreNumber) && scoreNumber >= relevantRule.minScore) {
      isPass = true;
    }
  }

  return {
    pass: isPass,
    testType: userTestType,
    currentScore: userScore,
    requiredScore: requiredScoreText,
    allRequirements: allReqText
  };
}

// --- 메인 체크 함수 ---

/**
 * 학생의 졸업 요건 충족 여부를 판별하는 메인 함수
 */
async function check(user, takenLectures, userCustomLectures, multiMajorLectures) {
  // 1. Rule Key 생성
  const track = user.userTrack || '';
  let ruleKey;
  if (track === '') {
    ruleKey = `${user.userDepartment}_${user.userYear}`;
  } else {
    ruleKey = `${user.userDepartment}_${track}_${user.userYear}`;
  }

  const requirements = allRules[ruleKey];
  if (!requirements) {
    throw new Error(`'${ruleKey}'에 해당하는 졸업요건 기준을 찾을 수 없습니다.`);
  }

  // 2. 학과별 학점 분류 함수 호출
  let classifiedCredits;
  if (user.userDepartment.includes("심화컴퓨터공학전공")) {
    // 심화컴퓨터공학전공 (ABEEK)
    classifiedCredits = classifyAndSumCredits_SC(takenLectures, userCustomLectures, multiMajorLectures);
  } else {
    // 글로벌SW융합전공 및 기타
    classifiedCredits = classifyAndSumCredits_GS(takenLectures, userCustomLectures, multiMajorLectures, user.userDepartment);
  }

  // 3. 결과 통합 (구조 분해 할당 및 기본값 설정)
  const {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    fieldPracticeCredits,
    multiMajorCredits,

    // GS 전용 (SC에서는 0)
    startupCourseCredits = 0,
    overseasCredits = 0,

    // SC 전용 (GS에서는 0)
    basicGeneralEducationCredits = 0,
    majorBasisCredits = 0,
    engineeringMajorCredits = 0,
    totalDesignCredits = 0
  } = classifiedCredits;

  const results = {};

  // 4. 공통 요건 체크

  // 교양 학점
  const geRule = requirements.generalEducationCredits;
  results.generalEducationCredits = {
    pass: generalEducationCredits >= geRule.min,
    current: generalEducationCredits,
    required: `${geRule.min} ~ ${geRule.max}`,
  };

  // 총 학점
  let recognizedGeCredits = Math.min(generalEducationCredits, geRule.max || Infinity);
  const recognizedTotalCredits = majorCredits + recognizedGeCredits + generalElectiveCredits + multiMajorCredits;
  results.totalCredits = {
    pass: recognizedTotalCredits >= requirements.minTotalCredits,
    current: recognizedTotalCredits,
    required: requirements.minTotalCredits,
    note: `교양 학점은 최대 ${geRule.max}학점까지만 반영됩니다.`
  };

  // 전공 학점
  results.majorCredits = {
    pass: majorCredits >= requirements.majorCredits.credits,
    current: majorCredits,
    required: requirements.majorCredits.credits,
  };

  // 전공 필수 과목
  const takenCourseCodes = takenLectures.map(lec => lec.lectCode) || [];
  const requiredCourses = requirements.requiredMajorCourses?.courses || [];
  const missingCourses = requiredCourses.filter(reqCode => !takenCourseCodes.includes(reqCode));

  const missingCourseNames = [];
  for (const courseCode of missingCourses) {
    const courseInfo = await lectures.findOne({ lectCode: courseCode });
    if (courseInfo) {
      missingCourseNames.push(courseInfo.lectName);
    } else {
      missingCourseNames.push(courseCode);
    }
  }

  results.requiredMajorCourses = {
    pass: missingCourses.length === 0,
    current: requiredCourses.length - missingCourses.length,
    required: requiredCourses.length,
    missing: missingCourseNames,
  };

  // 지도 교수 상담
  results.counselingSessions = {
    pass: (user.counselingCount || 0) >= requirements.counselingSessions.minRequired,
    current: user.counselingCount || 0,
    required: requirements.counselingSessions.minRequired,
  };

  // TOPCIT / 졸업인터뷰
  results.exitRequirement = {
    pass: (user.passedTopcit || false) || (user.passedInterview || false),
    note: requirements.exitRequirement.note,
  };

  // 영어 성적
  const englishResult = checkEnglishProficiency(user, requirements.englishProficiency);
  // 통과 시 note 숨김 처리 (선택 사항)
  let englishNote = requirements.englishProficiency.note;
  if (englishResult.pass) englishNote = null;

  results.englishProficiency = {
    ...englishResult,
    note: englishNote,
  };

  // 5. 조건부 요건 체크

  // [SC 전용] ABEEK 세부 학점
  if (requirements.basicGeneralEducationCredits) {
    const rule = requirements.basicGeneralEducationCredits;
    results.basicGeneralEducationCredits = {
      pass: basicGeneralEducationCredits >= rule.min,
      current: basicGeneralEducationCredits,
      required: rule.min,
      note: rule.note
    };
  }
  if (requirements.majorBasisCredits) {
    const rule = requirements.majorBasisCredits;
    results.majorBasisCredits = {
      pass: majorBasisCredits >= rule.min,
      current: majorBasisCredits,
      required: rule.min,
      note: rule.note
    };
  }
  if (requirements.engineeringMajorCredits) {
    const rule = requirements.engineeringMajorCredits;
    results.engineeringMajorCredits = {
      pass: engineeringMajorCredits >= rule.min,
      current: engineeringMajorCredits,
      required: rule.min,
      note: rule.note
    };
  }

  // [공통/분기] 캡스톤 디자인 (설계)
  if (requirements.capstoneDesignRequirement) {
    const capstoneRule = requirements.capstoneDesignRequirement;

    // Case A: 최소 설계 학점 (심화컴퓨터공학전공)
    if (capstoneRule.minDesignCredits !== undefined) {
      results.capstoneDesignRequirement = {
        pass: totalDesignCredits >= capstoneRule.minDesignCredits,
        current: totalDesignCredits,
        required: capstoneRule.minDesignCredits + "학점",
        note: capstoneRule.note
      };
    }
    // Case B: 과목 옵션 선택 (글로벌SW융합전공)
    else if (capstoneRule.options && Array.isArray(capstoneRule.options)) {
      const requiredOptions = capstoneRule.options.map(opt => opt.courseCode);
      const passedCourse = requiredOptions.find(code => takenCourseCodes.includes(code));

      results.capstoneDesignRequirement = {
        pass: !!passedCourse,
        current: passedCourse || '미이수',
        required: requiredOptions.join(' 또는 '),
        note: capstoneRule.note
      };
    }
  }

  // [GS 전용] 현장실습 (심컴도 있을 수 있음 - 요건 존재 여부로 판단)
  if (requirements.internshipRequirement && requirements.internshipRequirement.minInternshipCredits) {
    const requiredCredits = requirements.internshipRequirement.minInternshipCredits;
    results.internship = {
      pass: fieldPracticeCredits >= requiredCredits,
      current: fieldPracticeCredits,
      required: requiredCredits,
      note: requirements.internshipRequirement.note
    };
  }

  // [GS 전용] 해외대학인정학점
  if (requirements.globalCompetency && requirements.globalCompetency.minOverseasCredits) {
    const requiredCredits = requirements.globalCompetency.minOverseasCredits;
    results.globalCompetency = {
      pass: overseasCredits >= requiredCredits,
      current: overseasCredits,
      required: requiredCredits,
      note: `해외 이수 학점 ${requiredCredits}학점 이상 이수`
    };
  }

  // [GS 전용] 창업 교과
  if (requirements.ventureCourseCompetency) {
    const startupRule = requirements.ventureCourseCompetency;
    let passedStartupCourse = false;
    let requiredCourseCredits = 0;

    // options 배열에서 venture_course 타입 찾기
    const courseRule = startupRule.options ? startupRule.options.find(opt => opt.type === 'venture_course') : null;
    const userFoundedStartup = user.isStartup || false;

    if (courseRule) {
      if (courseRule.minCredits) {
        requiredCourseCredits = courseRule.minCredits;
      } else if (courseRule.baseCredits) {
        if (!userFoundedStartup && courseRule.alternative && courseRule.alternative.condition === 'if_not_startup_founded') {
          requiredCourseCredits = courseRule.alternative.requiredCredits;
        } else {
          requiredCourseCredits = courseRule.baseCredits;
        }
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

  // 6. 최종 결과 반환
  const isEligible = Object.values(results).every(result => result.pass);

  return {
    eligible: isEligible,
    checkedAt: new Date().toISOString(),
    details: results,
    creditSummary: {
      majorCredits,
      generalEducationCredits,
      generalElectiveCredits,
      startupCourseCredits,
      fieldPracticeCredits,
      overseasCredits,
      multiMajorCredits,
      // ABEEK 세부 항목
      basicGeneralEducationCredits,
      majorBasisCredits,
      engineeringMajorCredits,
      totalDesignCredits
    }
  };
}

module.exports = {
  check
};