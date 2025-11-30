const allRules = require('../config/graduationRules.js');
const courseConfig = require('../config/courseConfig.json'); // 통합된 설정 파일
const lectures = require('../models/lectures.js');

const {
  majorCourses,
  ventureCourses,
  generalEducation
} = courseConfig;

// [헬퍼] 리스트에 과목 추가
const addToList = (list, lecture, category, creditOverride = null) => {
  const credit = creditOverride !== null
    ? Number(creditOverride)
    : Number(lecture.lectCredit || lecture.totalCredit || 0);

  list.push({
    code: lecture.lectCode || 'Custom',
    name: lecture.lectName,
    credit: credit,
    category: category
  });
};

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

  // 상세 리스트
  const majorList = [];
  const generalEducationList = [];
  const generalElectiveList = [];
  const multiMajorList = [];
  const startupList = [];
  const fieldPracticeList = [];
  const overseasList = [];
  const sdgList = [];

  // [추가] 첨성인 리스트 초기화
  const knuBasicReadingDebateList = [];
  const knuBasicMathScienceList = [];
  const knuCoreHumanitySocietyList = [];
  const knuCoreNaturalScienceList = [];

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
      addToList(majorList, lecture, '전공');
    } else if (lecture.lectGeneral === '교양' || lecture.lectGeneral === '기본소양') {
      generalEducationCredits += credits;
      addToList(generalEducationList, lecture, '교양');
    } else {
      generalElectiveCredits += credits;
      addToList(generalElectiveList, lecture, '일반선택');
    }

    if (ventureCourseList.includes(courseCode)) {
      startupCourseCredits += credits;
      addToList(startupList, lecture, '창업교과');
    }

    if (isMajor && lecture.isEnglishLecture) {
      overseasCredits += 1;
      addToList(overseasList, lecture, '해외학점(원어강의)', 1);
    }

    if (knuBasicList.readingDebate?.includes(courseCode)) {
      knuBasicReadingDebate += credits;
      addToList(knuBasicReadingDebateList, lecture, '기초(독서/토론)');
    }
    if (knuBasicList.mathScience?.includes(courseCode)) {
      knuBasicMathScience += credits;
      addToList(knuBasicMathScienceList, lecture, '기초(수리/과학)');
    }
    if (knuCoreList.humanitySociety?.includes(courseCode)) {
      knuCoreHumanitySociety += credits;
      addToList(knuCoreHumanitySocietyList, lecture, '핵심(인문/사회)');
    }
    if (knuCoreList.naturalScience?.includes(courseCode)) {
      knuCoreNaturalScience += credits;
      addToList(knuCoreNaturalScienceList, lecture, '핵심(자연/과학)');
    }

    if (lecture.isSDGLecture) {
      sdgCredits += Number(lecture.lectCredit) || 0;
      addToList(sdgList, lecture, 'SDG');
    }
  });

  userCustomLectures.forEach(lecture => {
    const credits = Number(lecture.totalCredit) || 0;
    const courseCode = lecture.lectCode;

    if (lecture.lectType === '교양') {
      generalEducationCredits += credits;
      addToList(generalEducationList, lecture, '교양(커스텀)');
    } else if (lecture.lectType === '전공') {
      majorCredits += credits;
      addToList(majorList, lecture, '전공(커스텀)');
    } else {
      generalElectiveCredits += credits;
      addToList(generalElectiveList, lecture, '일반선택(커스텀)');
    }

    const startupCourseCredit = Number(lecture.startupCourseCredit) || 0;
    if (lecture.startupCourseCredit > 0) {
      startupCourseCredits += startupCourseCredit;
      addToList(startupList, lecture, '창업(커스텀)', lecture.startupCourseCredit);
    }

    const overseasCredit = Number(lecture.overseasCredit) || 0;
    if (lecture.overseasCredit > 0) {
      overseasCredits += overseasCredit;
      addToList(overseasList, lecture, '해외학점(커스텀)', lecture.overseasCredit);
    }

    const fieldPracticeCredit = Number(lecture.fieldPracticeCredit) || 0;
    if (lecture.fieldPracticeCredit > 0) {
      fieldPracticeCredits += fieldPracticeCredit;
      addToList(fieldPracticeList, lecture, '현장실습(커스텀)', lecture.fieldPracticeCredit);
    }

    // if (knuBasicList.readingDebate?.includes(courseCode)) {
    //   knuBasicReadingDebate += credits;
    // }
    // if (knuBasicList.mathScience?.includes(courseCode)) {
    //   knuBasicMathScience += credits;
    // }
    // if (knuCoreList.humanitySociety?.includes(courseCode)) {
    //   knuCoreHumanitySociety += credits;
    // }
    // if (knuCoreList.naturalScience?.includes(courseCode)) {
    //   knuCoreNaturalScience += credits;
    // }

    if (lecture.isSDGLecture) {
      sdgCredits += credits;
    } if (lecture.knuBasicReading) {
      knuBasicReadingDebate += credits;
      addToList(knuBasicReadingDebateList, lecture, '기초(독서/토론) 커스텀');
    } if (lecture.knuBasicMath) {
      knuBasicMathScience += credits;
      addToList(knuBasicMathScienceList, lecture, '기초(수리/과학) 커스텀');
    } if (lecture.knuCoreHumanity) {
      knuCoreHumanitySociety += credits;
      addToList(knuCoreHumanitySocietyList, lecture, '핵심(인문/사회) 커스텀');
    } if (lecture.knuCoreNaturalScience) {
      knuCoreNaturalScience += credits;
      addToList(knuCoreNaturalScienceList, lecture, '핵심(자연/과학) 커스텀');
    }

  });

  multiMajorLectures.forEach(lecture => {
    const credit = Number(lecture.lectCredit) || 0;
    multiMajorCredits += credit;
    //addToList(multiMajorList, lecture, '다중전공');

    // 다중전공 과목은 일반선택으로 분류
    generalElectiveCredits += credit;
    addToList(generalElectiveList, lecture, '일반선택(다중전공)');

    if (ventureCourseList.includes(lecture.lectCode)) {
      startupCourseCredits += credit;
      addToList(startupList, lecture, '창업(다중전공)');
    }

    const isMajor = ourMajorCourseList.includes(lecture.lectCode) && lecture.lectDepartment.includes("컴퓨터학부");
    if (isMajor && lecture.isEnglishLecture) {
      overseasCredits += 1;
      addToList(overseasList, lecture, '해외학점(다중전공)', 1);
    }
  });

  return {
    majorCredits, majorList,
    generalEducationCredits, generalEducationList,
    generalElectiveCredits, generalElectiveList,
    startupCourseCredits, startupList,
    fieldPracticeCredits, fieldPracticeList,
    overseasCredits, overseasList,
    multiMajorCredits, multiMajorList,
    sdgCredits, sdgList,
    // [추가] 첨성인 리스트 반환
    knuBasicReadingDebate, knuBasicReadingDebateList,
    knuBasicMathScience, knuBasicMathScienceList,
    knuCoreHumanitySociety, knuCoreHumanitySocietyList,
    knuCoreNaturalScience, knuCoreNaturalScienceList
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

  const majorList = [];
  const generalEducationList = [];
  const generalElectiveList = [];
  const multiMajorList = [];
  const startupList = [];
  const overseasList = [];

  const basicGenEdDetail = [];
  const majorBasisDetail = [];
  const engineeringMajorDetail = [];
  const designDetail = [];
  const fieldPracticeList = [];
  const sdgList = [];
  // [추가] 첨성인 리스트
  const knuBasicReadingDebateList = [];
  const knuBasicMathScienceList = [];
  const knuCoreHumanitySocietyList = [];
  const knuCoreNaturalScienceList = [];

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

    const isComputer =
      lecture.lectDepartment.includes('컴퓨터학부') || (lecture.lectSemester === '계절학기(하계)' || lecture.lectSemester === '계절학기(동계)');

    // 1. ABEEK 세부 분류 (우선순위 처리)

    // 공학 전공
    if (engineeringMajorList.includes(courseCode) && isComputer) {
      engineeringMajorCredits += credits;
      addToList(engineeringMajorDetail, lecture, '공학전공');
      majorCredits += credits;
      addToList(majorList, lecture, '공학전공');
    }
    // 전공기반
    else if (majorBasisList.includes(courseCode) && isComputer) {
      majorBasisCredits += credits;
      addToList(majorBasisDetail, lecture, '전공기반');
      majorCredits += credits;
      addToList(majorList, lecture, '전공기반');
    }
    // 기본소양
    else if (basicGenEdList.includes(courseCode) && isComputer) {
      basicGeneralEducationCredits += credits;
      addToList(basicGenEdDetail, lecture, '기본소양');
    }
    else if (lecture.lectGeneral === '교양' || lecture.lectGeneral === '기본소양') {
      generalEducationCredits += credits;
      addToList(generalEducationList, lecture, '교양');
    } else {
      generalElectiveCredits += credits;
      addToList(generalElectiveList, lecture, '일반선택');
    }

    // 2. 설계 학점
    if (designCourseList.includes(courseCode)) {
      if (courseCode.slice(0, 4) === 'ITEC') {
        totalDesignCredits += 4;
        addToList(designDetail, lecture, '설계', 4);
      }
      else {
        totalDesignCredits += 2;
        addToList(designDetail, lecture, '설계', 2);
      }
    }

    // // 3. 첨성인 기초/핵심
    // if (knuBasicList.readingDebate?.includes(courseCode)) {
    //   knuBasicReadingDebate += credits;
    // }
    // if (knuBasicList.mathScience?.includes(courseCode)) {
    //   knuBasicMathScience += credits;
    // }
    // if (knuCoreList.humanitySociety?.includes(courseCode)) {
    //   knuCoreHumanitySociety += credits;
    // }
    // if (knuCoreList.naturalScience?.includes(courseCode)) {
    //   knuCoreNaturalScience += credits;
    // }

    // if (lecture.isSDGLecture) {
    //   sdgCredits += Number(lecture.lectCredit) || 0;
    // }
  });

  userCustomLectures.forEach(lecture => {
    const credits = Number(lecture.totalCredit) || 0;
    const courseCode = lecture.lectCode;

    if (lecture.lectType === '공학전공' /*&& engineeringMajorList.includes(courseCode)*/) {
      engineeringMajorCredits += credits;
      addToList(engineeringMajorDetail, lecture, '공학전공(커스텀)');
      // majorCredits += credits;
    } else if (lecture.lectType === '전공기반' /*&& majorBasisList.includes(courseCode)*/) {
      majorBasisCredits += credits;
      addToList(majorBasisDetail, lecture, '전공기반(커스텀)');
      // majorCredits += credits;
    } else if (lecture.lectType === '기본소양(전문교양)' /*&& basicGenEdList.includes(courseCode)*/) {
      basicGeneralEducationCredits += credits;
      addToList(basicGenEdDetail, lecture, '기본소양(커스텀)');
      //  generalEducationCredits += credits;
      // } else if (lecture.lectType === '전공') {
      //  majorCredits += credits;
    } else if (lecture.lectType === '교양') {
      generalEducationCredits += credits;
      addToList(generalEducationList, lecture, '교양(커스텀)');
    } else {
      generalElectiveCredits += credits;
      addToList(generalElectiveList, lecture, '일반선택(커스텀)');
    }

    // if (lecture.lectType === '교양') {
    //   generalEducationCredits += credits;
    // } else if (lecture.lectType === '전공') {
    //   majorCredits += credits;
    // } else {
    //   generalElectiveCredits += credits;
    // }

    const fieldPracticeCredit = Number(lecture.fieldPracticeCredit) || 0;
    if (lecture.fieldPracticeCredit > 0) {
      fieldPracticeCredits += fieldPracticeCredit;
      addToList(fieldPracticeList, lecture, '현장실습(커스텀)', lecture.fieldPracticeCredit);
    }

    if (designCourseList.includes(courseCode)) {
      if (courseCode.slice(0, 4) === 'ITEC') {
        totalDesignCredits += 4;
        addToList(designDetail, lecture, '설계(커스텀)', 4);
      }
      else {
        totalDesignCredits += 2;
        addToList(designDetail, lecture, '설계(커스텀)', 2);
      }
    }

    // if (knuBasicList.readingDebate?.includes(courseCode)) {
    //   knuBasicReadingDebate += credits;
    // }
    // if (knuBasicList.mathScience?.includes(courseCode)) {
    //   knuBasicMathScience += credits;
    // }
    // if (knuCoreList.humanitySociety?.includes(courseCode)) {
    //   knuCoreHumanitySociety += credits;
    // }
    // if (knuCoreList.naturalScience?.includes(courseCode)) {
    //   knuCoreNaturalScience += credits;
    // })

    // if (lecture.isSDGLecture) {
    //   sdgCredits += credits;
    // }

  });

  multiMajorLectures.forEach(lecture => {
    const credit = Number(lecture.lectCredit) || 0;
    multiMajorCredits += credit;
    //addToList(multiMajorList, lecture, '다중전공');

    // 다중전공 과목은 일반선택으로 분류
    generalElectiveCredits += credit;
    addToList(generalElectiveList, lecture, '일반선택(다중전공)');
  });

  return {
    majorCredits, majorList,
    generalEducationCredits, generalEducationList,
    generalElectiveCredits, generalElectiveList,
    fieldPracticeCredits, fieldPracticeList,
    multiMajorCredits, multiMajorList,

    startupCourseCredits: 0, startupList,
    overseasCredits: 0, overseasList,

    basicGeneralEducationCredits, basicGenEdDetail,
    majorBasisCredits, majorBasisDetail,
    engineeringMajorCredits, engineeringMajorDetail,
    totalDesignCredits, designDetail,

    knuBasicReadingDebate, knuBasicReadingDebateList,
    knuBasicMathScience, knuBasicMathScienceList,
    knuCoreHumanitySociety, knuCoreHumanitySocietyList,
    knuCoreNaturalScience, knuCoreNaturalScienceList,

    sdgCredits, sdgList
  };
}

/**
 *  [인공지능컴퓨팅전공] 학점 계산 함수
 */
function classifyAndSumCredits_AC(takenLectures, userCustomLectures, multiMajorLectures, userDepartment) {
  let majorCredits = 0;
  let generalEducationCredits = 0;
  let generalElectiveCredits = 0;
  let fieldPracticeCredits = 0;
  let multiMajorCredits = 0;

  // [수정] 누락된 변수 초기화 추가
  let startupCourseCredits = 0;
  let overseasCredits = 0;

  let knuBasicReadingDebate = 0;
  let knuBasicMathScience = 0;
  let knuCoreHumanitySociety = 0;
  let knuCoreNaturalScience = 0;

  let sdgCredits = 0;

  // 상세 리스트
  const majorList = [];
  const generalEducationList = [];
  const generalElectiveList = [];
  const multiMajorList = [];
  const startupList = [];
  const fieldPracticeList = [];
  const overseasList = [];
  const sdgList = [];
  // [추가] 첨성인 리스트 초기화
  const knuBasicReadingDebateList = [];
  const knuBasicMathScienceList = [];
  const knuCoreHumanitySocietyList = [];
  const knuCoreNaturalScienceList = [];

  const knuBasicList = generalEducation.knuBasic || {};
  const knuCoreList = generalEducation.knuCore || {};

  // 데이터 로드: "글로벌SW융합전공" 같은 단순 배열 형태
  const ourMajorCourseList = majorCourses[userDepartment] || [];

  takenLectures.forEach(lecture => {
    const credits = Number(lecture.lectCredit) || 0;
    const courseCode = lecture.lectCode;

    const isMajor = ourMajorCourseList.includes(courseCode) && lecture.lectDepartment.includes("컴퓨터학부");

    if (isMajor) {
      majorCredits += credits;
      addToList(majorList, lecture, '전공');
    } else if (lecture.lectGeneral === '교양' || lecture.lectGeneral === '기본소양') {
      generalEducationCredits += credits;
      addToList(generalEducationList, lecture, '교양');
    } else {
      generalElectiveCredits += credits;
      addToList(generalElectiveList, lecture, '일반선택');
    }

    if (knuBasicList.readingDebate?.includes(courseCode)) {
      knuBasicReadingDebate += credits;
      addToList(knuBasicReadingDebateList, lecture, '기초(독서/토론)');
    }
    if (knuBasicList.mathScience?.includes(courseCode)) {
      knuBasicMathScience += credits;
      addToList(knuBasicMathScienceList, lecture, '기초(수리/과학)');
    }
    if (knuCoreList.humanitySociety?.includes(courseCode)) {
      knuCoreHumanitySociety += credits;
      addToList(knuCoreHumanitySocietyList, lecture, '핵심(인문/사회)');
    }
    if (knuCoreList.naturalScience?.includes(courseCode)) {
      knuCoreNaturalScience += credits;
      addToList(knuCoreNaturalScienceList, lecture, '핵심(자연/과학)');
    }

    if (lecture.isSDGLecture) {
      sdgCredits += Number(lecture.lectCredit) || 0;
      addToList(sdgList, lecture, 'SDG');
    }
  });

  userCustomLectures.forEach(lecture => {
    const credits = Number(lecture.totalCredit) || 0;
    const courseCode = lecture.lectCode;

    if (lecture.lectType === '교양') {
      generalEducationCredits += credits;
      addToList(generalEducationList, lecture, '교양(커스텀)');
    } else if (lecture.lectType === '전공') {
      majorCredits += credits;
      addToList(majorList, lecture, '전공(커스텀)');
    } else {
      generalElectiveCredits += credits;
      addToList(generalElectiveList, lecture, '일반선택(커스텀)');
    }

    const fieldPracticeCredit = Number(lecture.fieldPracticeCredit) || 0;
    if (lecture.fieldPracticeCredit > 0) {
      fieldPracticeCredits += fieldPracticeCredit;
      addToList(fieldPracticeList, lecture, '현장실습(커스텀)', lecture.fieldPracticeCredit);
    }

    // if (knuBasicList.readingDebate?.includes(courseCode)) {
    //   knuBasicReadingDebate += credits;
    // }
    // if (knuBasicList.mathScience?.includes(courseCode)) {
    //   knuBasicMathScience += credits;
    // }
    // if (knuCoreList.humanitySociety?.includes(courseCode)) {
    //   knuCoreHumanitySociety += credits;
    // }
    // if (knuCoreList.naturalScience?.includes(courseCode)) {
    //   knuCoreNaturalScience += credits;
    // }

    if (lecture.isSDGLecture) {
      sdgCredits += credits;
      addToList(sdgList, lecture, 'SDG(커스텀)');
    } if (lecture.knuBasicReading) {
      knuBasicReadingDebate += credits;
      addToList(knuBasicReadingDebateList, lecture, '기초(독서/토론) 커스텀');
    } if (lecture.knuBasicMath) {
      knuBasicMathScience += credits;
      addToList(knuBasicMathScienceList, lecture, '기초(수리/과학) 커스텀');
    } if (lecture.knuCoreHumanity) {
      knuCoreHumanitySociety += credits;
      addToList(knuCoreHumanitySocietyList, lecture, '핵심(인문/사회) 커스텀');
    } if (lecture.knuCoreNaturalScience) {
      knuCoreNaturalScience += credits;
      addToList(knuCoreNaturalScienceList, lecture, '핵심(자연/과학) 커스텀');
    }

  });

  multiMajorLectures.forEach(lecture => {
    const credit = Number(lecture.lectCredit) || 0;
    multiMajorCredits += credit;
    //addToList(multiMajorList, lecture, '다중전공');

    // 다중전공 과목은 일반선택으로 분류
    generalElectiveCredits += credit;
    addToList(generalElectiveList, lecture, '일반선택(다중전공)');
  });

  return {
    majorCredits, majorList,
    generalEducationCredits, generalEducationList,
    generalElectiveCredits, generalElectiveList,
    startupCourseCredits, startupList,
    fieldPracticeCredits, fieldPracticeList,
    overseasCredits, overseasList,
    multiMajorCredits, multiMajorList,
    sdgCredits, sdgList,

    knuBasicReadingDebate, knuBasicReadingDebateList,
    knuBasicMathScience, knuBasicMathScienceList,
    knuCoreHumanitySociety, knuCoreHumanitySocietyList,
    knuCoreNaturalScience, knuCoreNaturalScienceList

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
    majorCredits, majorList,
    generalEducationCredits, generalEducationList,
    generalElectiveCredits, generalElectiveList,
    fieldPracticeCredits, fieldPracticeList,
    multiMajorCredits, multiMajorList,

    startupCourseCredits = 0, startupList = [],
    overseasCredits = 0, overseasList = [],

    basicGeneralEducationCredits = 0, basicGenEdDetail,
    majorBasisCredits = 0, majorBasisDetail,
    engineeringMajorCredits = 0, engineeringMajorDetail,
    totalDesignCredits = 0, designDetail,

    knuBasicReadingDebate, knuBasicReadingDebateList,
    knuBasicMathScience, knuBasicMathScienceList,
    knuCoreHumanitySociety, knuCoreHumanitySocietyList,
    knuCoreNaturalScience, knuCoreNaturalScienceList,
    sdgCredits, sdgList
  } = classifiedCredits;

  const results = {};
  const requiredCourses = requirements.requiredMajorCourses?.courses || [];

  // majorList에 있는 과목 중 필수 과목에 해당하면 category를 '전공필수'로 변경
  if (majorList && majorList.length > 0) {
    majorList.forEach(item => {
      if (requiredCourses.includes(item.code)) {
        item.category = '전공필수';
      }
    });
  }

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
    recognized: recognizedGeCredits,
    required: geRequiredText,
    detail: generalEducationList
  };

  // If there's a maximum cap for 교양 학점, allocate the 'recognized' (반영) credits
  // to individual items in the generalEducationList so the client can show per-item counted credits.
  if (geRule.max) {
    let remaining = recognizedGeCredits;
    for (const item of generalEducationList) {
      const orig = Number(item.credit) || 0;
      const alloc = Math.min(orig, remaining);
      item.counted = alloc;
      remaining -= alloc;
      if (remaining <= 0) remaining = 0;
    }
  }

  const totalList = [
    ...majorList,
    ...generalEducationList,
    ...generalElectiveList,
    ...multiMajorList,
    ...(isAbeekMajor ? basicGenEdDetail : []) // ABEEK이면 기본소양도 총점에 포함
  ];
  // const recognizedTotalCredits = majorCredits + Math.min(generalEducationCredits, geRule.max || Infinity) + generalElectiveCredits + multiMajorCredits;

  // 총학점 계산: 심컴(ABEEK) vs 글솝/인컴
  let recognizedTotalCredits;

  if (isAbeekMajor) {
    // 심컴: 기본소양 + 전공기반 + 공학전공 + 교양 + 일반선택
    recognizedTotalCredits = majorCredits + recognizedGeCredits + basicGeneralEducationCredits + generalElectiveCredits;
  } else {
    // 글솝/인컴: 전공 + 교양 + 일반선택
    recognizedTotalCredits = majorCredits + recognizedGeCredits + generalElectiveCredits;
  }

  results.totalCredits = {
    pass: recognizedTotalCredits >= requirements.minTotalCredits,
    current: recognizedTotalCredits,
    required: requirements.minTotalCredits,
    note: geNote,
    detail: totalList
  };

  if (requirements.majorCredits) {
    results.majorCredits = {
      pass: majorCredits >= requirements.majorCredits.credits,
      current: majorCredits,
      required: requirements.majorCredits.credits,
      detail: majorList
    };
  }

  const takenCourseCodes = takenLectures.map(lec => lec.lectCode) || [];

  const missingCourses = requiredCourses.filter(reqCode => !takenCourseCodes.includes(reqCode));
  const takenRequiredList = [];
  takenLectures.forEach(l => {
    if (requiredCourses.includes(l.lectCode)) addToList(takenRequiredList, l, '전공필수');
  });
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
      detail: sdgList,
      note: rule.note
    };
  }

  results.requiredMajorCourses = {
    pass: missingCourses.length === 0,
    current: requiredCourses.length - missingCourses.length,
    required: requiredCourses.length,
    missing: missingCourseNames,
    detail: takenRequiredList
  };

  results.counselingSessions = {
    pass: (user.counselingCount || 0) >= requirements.counselingSessions.minRequired,
    current: user.counselingCount || 0,
    required: requirements.counselingSessions.minRequired,
  };

  if (requirements.exitRequirement) {
    const exitReq = requirements.exitRequirement;
    const exitOptions = exitReq.options || [];
    const isInterviewAllowed = exitOptions.some(opt => opt.type === 'graduation_interview');

    let exitPass = false;
    if (isInterviewAllowed) {
      exitPass = (user.passedTopcit || false) || (user.passedInterview || false);
    } else {
      exitPass = (user.passedTopcit || false);
    }
    results.exitRequirement = { pass: exitPass, note: exitReq.note };
  }

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
      note: rule.note,
      detail: basicGenEdDetail
    };
  }
  if (requirements.majorBasisCredits) {
    const rule = requirements.majorBasisCredits;
    results.majorBasisCredits = {
      pass: majorBasisCredits >= rule.min,
      current: majorBasisCredits,
      required: rule.min,
      note: rule.note,
      detail: majorBasisDetail,
    };
  }
  if (requirements.engineeringMajorCredits) {
    const rule = requirements.engineeringMajorCredits;
    results.engineeringMajorCredits = {
      pass: engineeringMajorCredits >= rule.min,
      current: engineeringMajorCredits,
      required: rule.min,
      note: rule.note,
      detail: engineeringMajorDetail
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
        note: rule.readingDebate.note,
        detail: knuBasicReadingDebateList
      },
      mathScience: {
        pass: mathSciencePass,
        current: knuBasicMathScience,
        required: rule.mathScience.min,
        note: rule.mathScience.note,
        detail: knuBasicMathScienceList
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
        note: rule.humanitySociety.note,
        detail: knuCoreHumanitySocietyList
      },
      naturalScience: {
        pass: knuCoreNaturalScience >= rule.naturalScience.min,
        current: knuCoreNaturalScience,
        required: rule.naturalScience.min,
        note: rule.naturalScience.note,
        detail: knuCoreNaturalScienceList
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
        note: capstoneRule.note,
        detail: designDetail
      };
    } else if (capstoneRule.options && Array.isArray(capstoneRule.options)) {
      const requiredOptions = capstoneRule.options.map(opt => opt.courseCode);
      const passedCourse = requiredOptions.find(code => takenCourseCodes.includes(code));
      results.capstoneDesignRequirement = {
        pass: !!passedCourse,
        current: passedCourse || '미이수',
        required: requiredOptions.join(' 또는 '),
        note: capstoneRule.note,
        detail: designDetail
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
      note: requirements.internshipRequirement.note,
      detail: fieldPracticeList
    };
  }

  if (requirements.globalCompetency && requirements.globalCompetency.minOverseasCredits) {
    const requiredCredits = requirements.globalCompetency.minOverseasCredits;
    results.globalCompetency = {
      pass: overseasCredits >= requiredCredits,
      current: overseasCredits,
      required: requiredCredits,
      note: `해외 이수 학점 ${requiredCredits}학점 이상 이수`,
      detail: overseasList
    };
  }

  // 해외복수학위 트랙: 해외복수학위과정 이수 여부
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
      detail: startupList,
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
      generalElectiveList,
      startupCourseCredits,
      fieldPracticeCredits,
      overseasCredits,
      multiMajorCredits,
      multiMajorList,
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