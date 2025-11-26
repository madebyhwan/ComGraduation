const allRules = require('../config/graduationRules.js');
const courseConfig = require('../config/courseConfig.json'); // 통합된 설정 파일
const lectures = require('../models/lectures.js');

const {
  majorCourses,
  ventureCourses,
  generalEducation
} = courseConfig;

/**
 * [글로벌SW융합전공] 학점 계산 함수
 */
function classifyAndSumCredits_GS(takenLectures, userCustomLectures, multiMajorLectures, userDepartment) {
  let majorCredits = 0;
  let generalEducationCredits = 0;
  let generalElectiveCredits = 0;
  let startupCourseCredits = 0;
  let fieldPracticeCredits = 0;
  let overseasCredits = 0;
  let multiMajorCredits = 0;

  let knuBasicReadingDebate = 0;
  let knuBasicMathScience = 0;
  let knuCoreHumanitySociety = 0;
  let knuCoreNaturalScience = 0;

  let sdgCredits = 0;

  const knuBasicList = generalEducation.knuBasic || {};
  const knuCoreList = generalEducation.knuCore || {};

  // 데이터 로드: "글로벌SW융합전공" 같은 단순 배열 형태
  const ourMajorCourseList = majorCourses[userDepartment] || [];
  const ventureCourseList = ventureCourses["ventures"];

  takenLectures.forEach(lecture => {
    const credits = Number(lecture.lectCredit) || 0;
    const courseCode = lecture.lectCode;

    const isMajor = ourMajorCourseList.includes(courseCode) && lecture.lectDepartment.includes("컴퓨터학부");

    if (isMajor) {
      majorCredits += credits;
    } else if (lecture.lectGeneral === '교양' || lecture.lectGeneral === '기본소양') {
      generalEducationCredits += credits;
    } else {
      generalElectiveCredits += credits;
    }

    if (ventureCourseList.includes(courseCode)) {
      startupCourseCredits += credits;
    }

    if (isMajor && lecture.isEnglishLecture) {
      overseasCredits += 1;
    }

    if (knuBasicList.readingDebate?.includes(courseCode)) {
      knuBasicReadingDebate += credits;
    }
    if (knuBasicList.mathScience?.includes(courseCode)) {
      knuBasicMathScience += credits;
    }
    if (knuCoreList.humanitySociety?.includes(courseCode)) {
      knuCoreHumanitySociety += credits;
    }
    if (knuCoreList.naturalScience?.includes(courseCode)) {
      knuCoreNaturalScience += credits;
    }

    if (lecture.isSDGLecture) {
      sdgCredits += Number(lecture.lectCredit) || 0;
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

    if (ventureCourseList.includes(lecture.lectCode)) {
      startupCourseCredits += credit;
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

    if (ventureCourseList.includes(lecture.lectCode)) {
      startupCourseCredits += credit;
    }

    const isMajor = ourMajorCourseList.includes(lecture.lectCode) && lecture.lectDepartment.includes("컴퓨터학부");
    if (isMajor && lecture.isEnglishLecture) {
      overseasCredits += 1;
    }
  });

  return {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    startupCourseCredits,
    fieldPracticeCredits,
    overseasCredits,
    sdgCredits,
    multiMajorCredits,
    knuBasicReadingDebate,
    knuBasicMathScience,
    knuCoreHumanitySociety,
    knuCoreNaturalScience
  };
}

/**
 * [공학인증용 - 심화컴퓨터공학전공 / 플랫폼SW&데이터과학전공] 학점 계산 함수
 */
function classifyAndSumCredits_ABEEK(takenLectures, userCustomLectures, multiMajorLectures) {
  let majorCredits = 0;
  let generalEducationCredits = 0;
  let generalElectiveCredits = 0;
  let fieldPracticeCredits = 0;
  let multiMajorCredits = 0;

  let basicGeneralEducationCredits = 0; // 기본소양
  let majorBasisCredits = 0;            // 전공기반
  let engineeringMajorCredits = 0;      // 공학전공
  let totalDesignCredits = 0;           // 설계

  let knuBasicReadingDebate = 0;
  let knuBasicMathScience = 0;
  let knuCoreHumanitySociety = 0;
  let knuCoreNaturalScience = 0;

  let sdgCredits = 0;

  // [수정됨] majorCourses 내의 ABEEK 공통 데이터를 로드
  const abeekData = majorCourses["심컴"] || {};
  const basicGenEdList = abeekData.basicGeneralEducation || [];
  const majorBasisList = abeekData.majorBasis || [];
  const engineeringMajorList = abeekData.engineeringMajor || [];
  const designCourseList = abeekData.designCourses || [];

  const knuBasicList = generalEducation.knuBasic || {};
  const knuCoreList = generalEducation.knuCore || {};

  takenLectures.forEach(lecture => {
    const credits = Number(lecture.lectCredit) || 0;
    const courseCode = lecture.lectCode;

    // 1. ABEEK 세부 분류 (우선순위 처리)
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

    // 2. 설계 학점
    if (designCourseList.includes(courseCode)) {
      totalDesignCredits += credits;
    }

    // 3. 첨성인 기초/핵심
    if (knuBasicList.readingDebate?.includes(courseCode)) {
      knuBasicReadingDebate += credits;
    }
    if (knuBasicList.mathScience?.includes(courseCode)) {
      knuBasicMathScience += credits;
    }
    if (knuCoreList.humanitySociety?.includes(courseCode)) {
      knuCoreHumanitySociety += credits;
    }
    if (knuCoreList.naturalScience?.includes(courseCode)) {
      knuCoreNaturalScience += credits;
    }

    if (lecture.isSDGLecture) {
      sdgCredits += Number(lecture.lectCredit) || 0;
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

    startupCourseCredits: 0,
    overseasCredits: 0,

    basicGeneralEducationCredits,
    majorBasisCredits,
    engineeringMajorCredits,
    totalDesignCredits,

    knuBasicReadingDebate,
    knuBasicMathScience,
    knuCoreHumanitySociety,
    knuCoreNaturalScience,
    sdgCredits
  };
}

/**
 *  [인공지능컴퓨팅] 학점 계산 함수
 */
function classifyAndSumCredits_AC(takenLectures, userCustomLectures, multiMajorLectures, userDepartment) {
  let majorCredits = 0;
  let generalEducationCredits = 0;
  let generalElectiveCredits = 0;
  let fieldPracticeCredits = 0;
  let multiMajorCredits = 0;

  let knuBasicReadingDebate = 0;
  let knuBasicMathScience = 0;
  let knuCoreHumanitySociety = 0;
  let knuCoreNaturalScience = 0;

  const knuBasicList = generalEducation.knuBasic || {};
  const knuCoreList = generalEducation.knuCore || {};

  // 데이터 로드: "글로벌SW융합전공" 같은 단순 배열 형태
  const ourMajorCourseList = majorCourses[userDepartment] || [];
  const ventureCourseList = ventureCourses["ventures"];

  takenLectures.forEach(lecture => {
    const credits = Number(lecture.lectCredit) || 0;
    const courseCode = lecture.lectCode;

    const isMajor = ourMajorCourseList.includes(courseCode) && lecture.lectDepartment.includes("컴퓨터학부");

    if (isMajor) {
      majorCredits += credits;
    } else if (lecture.lectGeneral === '교양' || lecture.lectGeneral === '기본소양') {
      generalEducationCredits += credits;
    } else {
      generalElectiveCredits += credits;
    }

    if (knuBasicList.readingDebate?.includes(courseCode)) {
      knuBasicReadingDebate += credits;
    }
    if (knuBasicList.mathScience?.includes(courseCode)) {
      knuBasicMathScience += credits;
    }
    if (knuCoreList.humanitySociety?.includes(courseCode)) {
      knuCoreHumanitySociety += credits;
    }
    if (knuCoreList.naturalScience?.includes(courseCode)) {
      knuCoreNaturalScience += credits;
    }

    if (lecture.isSDGLecture) {
      sdgCredits += Number(lecture.lectCredit) || 0;
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

    if (ventureCourseList.includes(lecture.lectCode)) {
      startupCourseCredits += credit;
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

    if (ventureCourseList.includes(lecture.lectCode)) {
      startupCourseCredits += credit;
    }

    const isMajor = ourMajorCourseList.includes(lecture.lectCode) && lecture.lectDepartment.includes("컴퓨터학부");
    if (isMajor && lecture.isEnglishLecture) {
      overseasCredits += 1;
    }
  });

  return {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    startupCourseCredits,
    fieldPracticeCredits,
    overseasCredits,
    multiMajorCredits,
    knuBasicReadingDebate,
    knuBasicMathScience,
    knuCoreHumanitySociety,
    knuCoreNaturalScience,
    sdgCredits
  };
}

// ... (영어 성적 함수 checkEnglishProficiency는 변경 없음) ...
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
    const opicHierarchy = ['IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL'];
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

  // 2. 학과별 학점 분류 함수 호출 (분기 로직 수정)
  let classifiedCredits;

  const isAbeekMajor =
    user.userDepartment.includes("심화컴퓨터공학전공") ||
    user.userDepartment.includes("플랫폼SW&데이터과학전공");

  if (isAbeekMajor) {
    // ABEEK 공통 로직 사용
    classifiedCredits = classifyAndSumCredits_ABEEK(takenLectures, userCustomLectures, multiMajorLectures);
  } else if (user.userDepartment.includes("글로벌SW융합전공")) {
    // 글로벌SW융합전공
    classifiedCredits = classifyAndSumCredits_GS(takenLectures, userCustomLectures, multiMajorLectures, user.userDepartment);
  } else if (user.userDepartment.includes("인공지능컴퓨팅전공")) {
    // 인공지능컴퓨팅전공
    classifiedCredits = classifyAndSumCredits_AC(takenLectures, userCustomLectures, multiMajorLectures, user.userDepartment);
  }

  // 3. 결과 통합
  const {
    majorCredits,
    generalEducationCredits,
    generalElectiveCredits,
    fieldPracticeCredits,
    multiMajorCredits,

    startupCourseCredits = 0,
    overseasCredits = 0,

    basicGeneralEducationCredits = 0,
    majorBasisCredits = 0,
    engineeringMajorCredits = 0,
    totalDesignCredits = 0,

    knuBasicReadingDebate = 0,
    knuBasicMathScience = 0,
    knuCoreHumanitySociety = 0,
    knuCoreNaturalScience = 0,
    sdgCredits
  } = classifiedCredits;

  const results = {};

  // 4. 공통 요건 체크
  const geRule = requirements.generalEducationCredits;
  let geNote = null;
  let recognizedGeCredits = generalEducationCredits;
  let geRequiredText = `${geRule.min} 이상`;

  if (geRule.max) {
    recognizedGeCredits = Math.min(generalEducationCredits, geRule.max);
    geNote = `교양 학점은 최대 ${geRule.max}학점까지만 반영됩니다.`;
    geRequiredText = `${geRule.min} ~ ${geRule.max}`;
  }

  results.generalEducationCredits = {
    pass: generalEducationCredits >= geRule.min,
    current: generalEducationCredits,
    required: geRequiredText,
  };

  const recognizedTotalCredits = majorCredits + recognizedGeCredits + generalElectiveCredits + multiMajorCredits;
  results.totalCredits = {
    pass: recognizedTotalCredits >= requirements.minTotalCredits,
    current: recognizedTotalCredits,
    required: requirements.minTotalCredits,
    note: geNote
  };

  results.majorCredits = {
    pass: majorCredits >= requirements.majorCredits.credits,
    current: majorCredits,
    required: requirements.majorCredits.credits,
  };

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

  if (requirements.sdgRequirement) {
    const rule = requirements.sdgRequirement;

    results.sdgRequirement = {
      pass: sdgCredits >= rule.minCredits,
      current: sdgCredits,
      required: rule.minCredits,
      note: rule.note
    };
  }

  results.requiredMajorCourses = {
    pass: missingCourses.length === 0,
    current: requiredCourses.length - missingCourses.length,
    required: requiredCourses.length,
    missing: missingCourseNames,
  };

  results.counselingSessions = {
    pass: (user.counselingCount || 0) >= requirements.counselingSessions.minRequired,
    current: user.counselingCount || 0,
    required: requirements.counselingSessions.minRequired,
  };

  const exitOptions = requirements.exitRequirement.options || [];
  const isInterviewAllowed = exitOptions.some(opt => opt.type === 'graduation_interview');
  let exitPass = false;
  if (isInterviewAllowed) {
    exitPass = (user.passedTopcit || false) || (user.passedInterview || false);
  } else {
    exitPass = (user.passedTopcit || false);
  }

  results.exitRequirement = {
    pass: exitPass,
    note: requirements.exitRequirement.note,
  };

  const englishResult = checkEnglishProficiency(user, requirements.englishProficiency);
  let englishNote = requirements.englishProficiency.note;
  if (englishResult.pass) englishNote = null;
  results.englishProficiency = {
    ...englishResult,
    note: englishNote,
  };

  // 5. 조건부 요건 체크

  // [ABEEK 전용] 세부 학점 (심화컴공 / 플랫폼SW)
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

  // [ABEEK 전용] 첨성인 기초/핵심
  if (requirements.knuBasicRequirement) {
    const rule = requirements.knuBasicRequirement;
    const exceptionRule = requirements.knuBasicException;

    let mathSciencePass = knuBasicMathScience >= rule.mathScience.min;
    if (exceptionRule && user.userYear >= exceptionRule.minYear) {
      if (exceptionRule.departments.some(dept => user.userDepartment.includes(dept))) {
        if (exceptionRule.exemptedArea.includes("mathScience")) {
          mathSciencePass = true;
        }
      }
    }

    results.knuBasicRequirement = {
      readingDebate: {
        pass: knuBasicReadingDebate >= rule.readingDebate.min,
        current: knuBasicReadingDebate,
        required: rule.readingDebate.min,
        note: rule.readingDebate.note
      },
      mathScience: {
        pass: mathSciencePass,
        current: knuBasicMathScience,
        required: rule.mathScience.min,
        note: rule.mathScience.note
      }
    };
  }

  if (requirements.knuCoreRequirement) {
    const rule = requirements.knuCoreRequirement;
    results.knuCoreRequirement = {
      humanitySociety: {
        pass: knuCoreHumanitySociety >= rule.humanitySociety.min,
        current: knuCoreHumanitySociety,
        required: rule.humanitySociety.min,
        note: rule.humanitySociety.note
      },
      naturalScience: {
        pass: knuCoreNaturalScience >= rule.naturalScience.min,
        current: knuCoreNaturalScience,
        required: rule.naturalScience.min,
        note: rule.naturalScience.note
      }
    };
  }

  // [공통] 캡스톤 디자인
  if (requirements.capstoneDesignRequirement) {
    const capstoneRule = requirements.capstoneDesignRequirement;
    if (capstoneRule.minDesignCredits !== undefined) {
      results.capstoneDesignRequirement = {
        pass: totalDesignCredits >= capstoneRule.minDesignCredits,
        current: totalDesignCredits,
        required: capstoneRule.minDesignCredits + "학점",
        note: capstoneRule.note
      };
    } else if (capstoneRule.options && Array.isArray(capstoneRule.options)) {
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

  // [GS 전용] 요건들
  if (requirements.internshipRequirement && requirements.internshipRequirement.minInternshipCredits) {
    const requiredCredits = requirements.internshipRequirement.minInternshipCredits;
    results.internship = {
      pass: fieldPracticeCredits >= requiredCredits,
      current: fieldPracticeCredits,
      required: requiredCredits,
      note: requirements.internshipRequirement.note
    };
  }

  if (requirements.globalCompetency && requirements.globalCompetency.minOverseasCredits) {
    const requiredCredits = requirements.globalCompetency.minOverseasCredits;
    results.globalCompetency = {
      pass: overseasCredits >= requiredCredits,
      current: overseasCredits,
      required: requiredCredits,
      note: `해외 이수 학점 ${requiredCredits}학점 이상 이수`
    };
  }

  if (requirements.globalDegreeRequirement) {
    const globalRule = requirements.globalDegreeRequirement;
    const isFulfilled = (user.isExchangeStudent === true);
    results.globalDegreeRequirement = {
      pass: isFulfilled,
      current: isFulfilled ? "이수 완료" : "미이수",
      note: globalRule.note
    };
  }

  if (requirements.ventureCourseCompetency) {
    const startupRule = requirements.ventureCourseCompetency;
    let passedStartupCourse = false;
    let requiredCourseCredits = 0;
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
  const isEligible = Object.values(results).every(result => {
    if (result.readingDebate && result.mathScience) { // knuBasic
      return result.readingDebate.pass && result.mathScience.pass;
    }
    if (result.humanitySociety && result.naturalScience) { // knuCore
      return result.humanitySociety.pass && result.naturalScience.pass;
    }
    return result.pass;
  });

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