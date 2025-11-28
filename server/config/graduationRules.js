const rules = {
  "글로벌SW융합전공_다중전공_25학번": {
    "trackName": "다중전공트랙 (25학번 기준)",
    "admissionYear": 2025,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "capstoneDesignRequirement": {
      "note": "종합설계교과목 (ITEC0401, ITEC0402 중 택 1)",
      "options": [
        { "courseCode": "ITEC0401" },
        { "courseCode": "ITEC0402" }
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    "sdgRequirement": {
      "minCredits": 3,
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 9
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 9학점, 창업 안 했을 시 15학점 필요",
          "baseCredits": 9,
          "alternative": {
            "condition": "if_not_startup_founded",
            "requiredCredits": 15
          }
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_해외복수학위_25학번": {
    "trackName": "해외복수학위트랙 (25학번 기준)",
    "admissionYear": 2025,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    "sdgRequirement": {
      "minCredits": 3,
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalDegreeRequirement": {
      "note": "해외복수학위 취득 또는 해외대학 교환학생 1년 이상 수료 필수",
      "options": [
        {
          "type": "exchange_student",
          "note": "해외 교환학생(1년 이상) 또는 복수학위 이수"
        }
      ]
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 3학점",
          "minCredits": 3
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 800 },
        { "test": "TOEIC SPEAKING", "minScore": 130 },
        { "test": "PBT", "minScore": 557 },
        { "test": "IBT", "minScore": 83 },
        { "test": "CBT", "minScore": 220 },
        { "test": "TEPS", "minScore": 637 },
        { "test": "TEPS SPEAKING", "minScore": 53 },
        { "test": "OPIC", "minLevel": "IM2" },
        { "test": "G-TELP", "minScore": 73 },
        { "test": "IELTS", "minScore": 7.0 }
      ]
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_학석사연계_25학번": {
    "trackName": "학석사연계트랙 (25학번 기준)",
    "admissionYear": 2025,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    "sdgRequirement": {
      "minCredits": 3,
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 6
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },

  "글로벌SW융합전공_다중전공_24학번": {
    "trackName": "다중전공트랙 (24학번 기준)",
    "admissionYear": 2024,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "capstoneDesignRequirement": {
      "note": "종합설계교과목 (ITEC0401, ITEC0402 중 택 1)",
      "options": [
        { "courseCode": "ITEC0401" },
        { "courseCode": "ITEC0402" }
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    "sdgRequirement": {
      "minCredits": 3,
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 9
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 9학점, 창업 안 했을 시 15학점 필요",
          "baseCredits": 9,
          "alternative": {
            "condition": "if_not_startup_founded",
            "requiredCredits": 15
          }
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_해외복수학위_24학번": {
    "trackName": "해외복수학위트랙 (24학번 기준)",
    "admissionYear": 2024,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    "sdgRequirement": {
      "minCredits": 3,
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalDegreeRequirement": {
      "note": "해외복수학위 취득 또는 해외대학 교환학생 1년 이상 수료 필수",
      "options": [
        {
          "type": "exchange_student",
          "note": "해외 교환학생(1년 이상) 또는 복수학위 이수"
        }
      ]
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 3학점",
          "minCredits": 3
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 800 },
        { "test": "TOEIC SPEAKING", "minScore": 130 },
        { "test": "PBT", "minScore": 557 },
        { "test": "IBT", "minScore": 83 },
        { "test": "CBT", "minScore": 220 },
        { "test": "TEPS", "minScore": 637 },
        { "test": "TEPS SPEAKING", "minScore": 53 },
        { "test": "OPIC", "minLevel": "IM2" },
        { "test": "G-TELP", "minScore": 73 },
        { "test": "IELTS", "minScore": 7.0 }
      ]
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_학석사연계_24학번": {
    "trackName": "학석사연계트랙 (24학번 기준)",
    "admissionYear": 2024,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    "sdgRequirement": {
      "minCredits": 3,
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 6
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },

  "글로벌SW융합전공_다중전공_23학번": {
    "trackName": "다중전공트랙 (23학번 기준)",
    "admissionYear": 2023,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "capstoneDesignRequirement": {
      "note": "종합설계교과목 (ITEC0401, ITEC0402 중 택 1)",
      "options": [
        { "courseCode": "ITEC0401" },
        { "courseCode": "ITEC0402" }
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 9
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 9학점, 창업 안 했을 시 15학점 필요",
          "baseCredits": 9,
          "alternative": {
            "condition": "if_not_startup_founded",
            "requiredCredits": 15
          }
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_해외복수학위_23학번": {
    "trackName": "해외복수학위트랙 (23학번 기준)",
    "admissionYear": 2023,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalDegreeRequirement": {
      "note": "해외복수학위 취득 또는 해외대학 교환학생 1년 이상 수료 필수",
      "options": [
        {
          "type": "exchange_student",
          "note": "해외 교환학생(1년 이상) 또는 복수학위 이수"
        }
      ]
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 3학점",
          "minCredits": 3
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 800 },
        { "test": "TOEIC SPEAKING", "minScore": 130 },
        { "test": "PBT", "minScore": 557 },
        { "test": "IBT", "minScore": 83 },
        { "test": "CBT", "minScore": 220 },
        { "test": "TEPS", "minScore": 637 },
        { "test": "TEPS SPEAKING", "minScore": 53 },
        { "test": "OPIC", "minLevel": "IM2" },
        { "test": "G-TELP", "minScore": 73 },
        { "test": "IELTS", "minScore": 7.0 }
      ]
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_학석사연계_23학번": {
    "trackName": "학석사연계트랙 (23학번 기준)",
    "admissionYear": 2023,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 6
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },

  "글로벌SW융합전공_다중전공_22학번": {
    "trackName": "다중전공트랙 (22학번 기준)",
    "admissionYear": 2022,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "capstoneDesignRequirement": {
      "note": "종합설계교과목 (ITEC0401, ITEC0402 중 택 1)",
      "options": [
        { "courseCode": "ITEC0401" },
        { "courseCode": "ITEC0402" }
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 9
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 9학점, 창업 안 했을 시 15학점 필요",
          "baseCredits": 9,
          "alternative": {
            "condition": "if_not_startup_founded",
            "requiredCredits": 15
          }
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_해외복수학위_22학번": {
    "trackName": "해외복수학위트랙 (22학번 기준)",
    "admissionYear": 2022,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalDegreeRequirement": {
      "note": "해외복수학위 취득 또는 해외대학 교환학생 1년 이상 수료 필수",
      "options": [
        {
          "type": "exchange_student",
          "note": "해외 교환학생(1년 이상) 또는 복수학위 이수"
        }
      ]
    },

    "globalDegreeRequirement": {
      "note": "해외복수학위 취득 또는 해외대학 교환학생 1년 이상 수료 필수",
      "options": [
        {
          "type": "exchange_student",
          "note": "해외 교환학생(1년 이상) 또는 복수학위 이수"
        }
      ]
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 3학점",
          "minCredits": 3
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 800 },
        { "test": "TOEIC SPEAKING", "minScore": 130 },
        { "test": "PBT", "minScore": 557 },
        { "test": "IBT", "minScore": 83 },
        { "test": "CBT", "minScore": 220 },
        { "test": "TEPS", "minScore": 637 },
        { "test": "TEPS SPEAKING", "minScore": 53 },
        { "test": "OPIC", "minLevel": "IM2" },
        { "test": "G-TELP", "minScore": 73 },
        { "test": "IELTS", "minScore": 7.0 }
      ]
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_학석사연계_22학번": {
    "trackName": "학석사연계트랙 (22학번 기준)",
    "admissionYear": 2022,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 6
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },

  "글로벌SW융합전공_다중전공_21학번": {
    "trackName": "다중전공트랙 (21학번 기준)",
    "admissionYear": 2021,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 9
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 9학점, 창업 안 했을 시 15학점 필요",
          "baseCredits": 9,
          "alternative": {
            "condition": "if_not_startup_founded",
            "requiredCredits": 15
          }
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_해외복수학위_21학번": {
    "trackName": "해외복수학위트랙 (21학번 기준)",
    "admissionYear": 2021,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalDegreeRequirement": {
      "note": "해외복수학위 취득 또는 해외대학 교환학생 1년 이상 수료 필수",
      "options": [
        {
          "type": "exchange_student",
          "note": "해외 교환학생(1년 이상) 또는 복수학위 이수"
        }
      ]
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 3학점",
          "minCredits": 3
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 800 },
        { "test": "TOEIC SPEAKING", "minScore": 130 },
        { "test": "PBT", "minScore": 557 },
        { "test": "IBT", "minScore": 83 },
        { "test": "CBT", "minScore": 220 },
        { "test": "TEPS", "minScore": 637 },
        { "test": "TEPS SPEAKING", "minScore": 53 },
        { "test": "OPIC", "minLevel": "IM2" },
        { "test": "G-TELP", "minScore": 73 },
        { "test": "IELTS", "minScore": 7.0 }
      ]
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_학석사연계_21학번": {
    "trackName": "학석사연계트랙 (21학번 기준)",
    "admissionYear": 2021,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 6
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },

  "글로벌SW융합전공_다중전공_20학번": {
    "trackName": "다중전공트랙 (20학번 기준)",
    "admissionYear": 2020,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 9
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 9학점, 창업 안 했을 시 15학점 필요",
          "baseCredits": 9,
          "alternative": {
            "condition": "if_not_startup_founded",
            "requiredCredits": 15
          }
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_해외복수학위_20학번": {
    "trackName": "해외복수학위트랙 (20학번 기준)",
    "admissionYear": 2020,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalDegreeRequirement": {
      "note": "해외복수학위 취득 또는 해외대학 교환학생 1년 이상 수료 필수",
      "options": [
        {
          "type": "exchange_student",
          "note": "해외 교환학생(1년 이상) 또는 복수학위 이수"
        }
      ]
    },

    "ventureCourseCompetency": {
      "note": "기술창업 교과목 이수 요건",
      "options": [
        {
          "type": "venture_course",
          "note": "기본 3학점",
          "minCredits": 3
        }
      ]
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 800 },
        { "test": "TOEIC SPEAKING", "minScore": 130 },
        { "test": "PBT", "minScore": 557 },
        { "test": "IBT", "minScore": 83 },
        { "test": "CBT", "minScore": 220 },
        { "test": "TEPS", "minScore": 637 },
        { "test": "TEPS SPEAKING", "minScore": 53 },
        { "test": "OPIC", "minLevel": "IM2" },
        { "test": "G-TELP", "minScore": 73 },
        { "test": "IELTS", "minScore": 7.0 }
      ]
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },
  "글로벌SW융합전공_학석사연계_20학번": {
    "trackName": "학석사연계트랙 (20학번 기준)",
    "admissionYear": 2020,

    "minTotalCredits": 130,

    "majorCredits": {
      "credits": 51,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0204",
        "COME0331",
        "GLSO0216",
        "COMP0312"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야하고 max까지만 인정됨.",
      "min": 24,
      "max": 42
    },

    "globalCompetency": {
      "note": "해외대학인정학점",
      "minOverseasCredits": 6
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        },
        {
          "type": "graduation_interview",
          "note": "졸업 인터뷰 통과",
          "required": true
        }
      ]
    }
  },

  "플랫폼SW&데이터과학전공_심컴_25학번": {
    "trackName": "심화컴퓨터공학전공 (25학번 기준)",
    "admissionYear": 2025,

    "minTotalCredits": 140,

    // "majorCredits": {
    //   "credits": 78,
    //   "note": "ABEEK 기준 전공 78학점 (전공기반 18학점 + 공학전공 60학점) 이상 이수"
    // },

    "generalEducationCredits": {
      "note": "ABEEK 적용 전공은 최소 교양 학점 기준이 없음",
      "min": 0
    },

    // "sdgRequirement": {
    //   "minCredits": 3,
    // },

    // // 첨성인 기초
    // "knuBasicRequirement": {
    //   "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
    //   "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    // },

    // // 첨성인 핵심
    // "knuCoreRequirement": {
    //   "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
    //   "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    // },

    "requiredMajorCourses": {
      "note": "학교 내규에 따른 전공필수과목 목록을 채워야 합니다.",
      "courses": [
        "CLTR0819", "COME0301", "COMP0204", "COMP0205", "COMP0217",
        "COME0331", "COMP0411", "ELEC0462", "COMP0312", "COMP0319", "ITEC0401", "ITEC0402"
      ]
    },

    "basicGeneralEducationCredits": {
      "min": 15,
      "note": "ABEEK 기본소양(전문교양) 최소 15학점 이수"
    },

    "majorBasisCredits": {
      "min": 18,
      "note": "ABEEK 전공기반 최소 18학점 이수"
    },

    "engineeringMajorCredits": {
      "min": 60,
      "note": "ABEEK 공학전공 최소 60학점 이수"
    },

    "capstoneDesignRequirement": {
      "note": "공학전공 학점 내 설계 학점 14학점 이상 필수",
      "minDesignCredits": 14
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점 3학점 이상 이수",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },

  "플랫폼SW&데이터과학전공_심컴_24학번": {
    "trackName": "심화컴퓨터공학전공 (24학번 기준)",
    "admissionYear": 2024,

    "minTotalCredits": 140,

    // "majorCredits": {
    //   "credits": 78,
    //   "note": "ABEEK 기준 전공 78학점 (전공기반 18학점 + 공학전공 60학점) 이상 이수"
    // },

    "generalEducationCredits": {
      "note": "ABEEK 적용 전공은 최소 교양 학점 기준이 없음",
      "min": 0
    },

    // "sdgRequirement": {
    //   "minCredits": 3,
    // },

    // // 첨성인 기초
    // "knuBasicRequirement": {
    //   "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
    //   "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    // },

    // // 첨성인 핵심
    // "knuCoreRequirement": {
    //   "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
    //   "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    // },

    "requiredMajorCourses": {
      "note": "학교 내규에 따른 전공필수과목 목록을 채워야 합니다.",
      "courses": [
        "CLTR0819", "COME0301", "COMP0204", "COMP0205", "COMP0217",
        "COME0331", "COMP0411", "ELEC0462", "COMP0312", "COMP0319", "ITEC0401", "ITEC0402"
      ]
    },

    "basicGeneralEducationCredits": {
      "min": 15,
      "note": "ABEEK 기본소양(전문교양) 최소 15학점 이수"
    },

    "majorBasisCredits": {
      "min": 18,
      "note": "ABEEK 전공기반 최소 18학점 이수"
    },

    "engineeringMajorCredits": {
      "min": 60,
      "note": "ABEEK 공학전공 최소 60학점 이수"
    },

    "capstoneDesignRequirement": {
      "note": "공학전공 학점 내 설계 학점 14학점 이상 필수",
      "minDesignCredits": 14
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점 3학점 이상 이수",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },

  "플랫폼SW&데이터과학전공_심컴_23학번": {
    "trackName": "심화컴퓨터공학전공 (23학번 기준)",
    "admissionYear": 2023,

    "minTotalCredits": 140,

    // "majorCredits": {
    //   "credits": 78,
    //   "note": "ABEEK 기준 전공 78학점 (전공기반 18학점 + 공학전공 60학점) 이상 이수"
    // },

    "generalEducationCredits": {
      "note": "ABEEK 적용 전공은 최소 교양 학점 기준이 없음",
      "min": 0
    },

    // // 첨성인 기초
    // "knuBasicRequirement": {
    //   "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
    //   "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    // },

    // // 첨성인 핵심
    // "knuCoreRequirement": {
    //   "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
    //   "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    // },

    "requiredMajorCourses": {
      "note": "학교 내규에 따른 전공필수과목 목록을 채워야 합니다.",
      "courses": [
        "CLTR0819", "COME0301", "COMP0204", "COMP0205", "COMP0217",
        "COME0331", "COMP0411", "ELEC0462", "COMP0312", "COMP0319", "ITEC0401", "ITEC0402"
      ]
    },

    "basicGeneralEducationCredits": {
      "min": 15,
      "note": "ABEEK 기본소양(전문교양) 최소 15학점 이수"
    },

    "majorBasisCredits": {
      "min": 18,
      "note": "ABEEK 전공기반 최소 18학점 이수"
    },

    "engineeringMajorCredits": {
      "min": 60,
      "note": "ABEEK 공학전공 최소 60학점 이수"
    },

    "capstoneDesignRequirement": {
      "note": "공학전공 학점 내 설계 학점 14학점 이상 필수",
      "minDesignCredits": 14
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점 3학점 이상 이수",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 필수",
      "options": [
        {
          "type": "topcit",
          "note": "TOPCIT 시험 응시",
          "required": true
        }
      ]
    }
  },

  "심화컴퓨터공학전공_심컴_22학번": {
    "trackName": "심화컴퓨터공학전공 (22학번 기준)",
    "admissionYear": 2022,

    "minTotalCredits": 140,

    // "majorCredits": {
    //   "credits": 78,
    //   "note": "ABEEK 기준 전공 78학점 (전공기반 18학점 + 공학전공 60학점) 이상 이수"
    // },

    "generalEducationCredits": {
      "note": "ABEEK 적용 전공은 최소 교양 학점 기준이 없음",
      "min": 0
    },

    "requiredMajorCourses": {
      "note": "학교 내규에 따른 전공필수과목 목록을 채워야 합니다.",
      "courses": [
        "CLTR0211", "CLTR0213", "COME0301", "COMP0204", "COMP0205", "COMP0217",
        "COME0331", "COMP0411", "ELEC0462", "COMP0312", "COMP0319", "ITEC0401", "ITEC0402"
      ]
    },

    "basicGeneralEducationCredits": {
      "min": 15,
      "note": "ABEEK 기본소양(전문교양) 최소 15학점 이수"
    },

    "majorBasisCredits": {
      "min": 18,
      "note": "ABEEK 전공기반 최소 18학점 이수"
    },

    "engineeringMajorCredits": {
      "min": 60,
      "note": "ABEEK 공학전공 최소 60학점 이수"
    },


    "capstoneDesignRequirement": {
      "note": "공학전공 학점 내 설계 학점 14학점 이상 필수",
      "minDesignCredits": 14
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점 3학점 이상 이수",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        { "type": "topcit", "note": "TOPCIT 시험 응시", "required": true },
        { "type": "graduation_interview", "note": "졸업 인터뷰 통과", "required": true }
      ]
    }
  },

  "심화컴퓨터공학전공_심컴_21학번": {
    "trackName": "심화컴퓨터공학전공 (21학번 기준)",
    "admissionYear": 2021,

    "minTotalCredits": 140,

    // "majorCredits": {
    //   "credits": 78,
    //   "note": "ABEEK 기준 전공 78학점 (전공기반 18학점 + 공학전공 60학점) 이상 이수"
    // },

    "generalEducationCredits": {
      "note": "ABEEK 적용 전공은 최소 교양 학점 기준이 없음",
      "min": 0
    },

    "requiredMajorCourses": {
      "note": "학교 내규에 따른 전공필수과목 목록을 채워야 합니다.",
      "courses": [
        "CLTR0211", "CLTR0213", "COME0301", "COMP0204", "COMP0205", "COMP0217",
        "COME0331", "COMP0411", "ELEC0462", "COMP0312", "COMP0319", "ITEC0401", "ITEC0402"
      ]
    },

    "basicGeneralEducationCredits": {
      "min": 15,
      "note": "ABEEK 기본소양(전문교양) 최소 15학점 이수"
    },

    "majorBasisCredits": {
      "min": 18,
      "note": "ABEEK 전공기반 최소 18학점 이수"
    },

    "engineeringMajorCredits": {
      "min": 60,
      "note": "ABEEK 공학전공 최소 60학점 이수"
    },


    "capstoneDesignRequirement": {
      "note": "공학전공 학점 내 설계 학점 14학점 이상 필수",
      "minDesignCredits": 14
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점 3학점 이상 이수",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        { "type": "topcit", "note": "TOPCIT 시험 응시", "required": true },
        { "type": "graduation_interview", "note": "졸업 인터뷰 통과", "required": true }
      ]
    }
  },

  "심화컴퓨터공학전공_심컴_20학번": {
    "trackName": "심화컴퓨터공학전공 (20학번 기준)",
    "admissionYear": 2020,

    "minTotalCredits": 150,

    // "majorCredits": {
    //   "credits": 96,
    //   "note": "ABEEK 기준 전공 78학점 (전공기반 18학점 + 공학전공 60학점) 이상 이수"
    // },

    "generalEducationCredits": {
      "note": "ABEEK 적용 전공은 최소 교양 학점 기준이 없음",
      "min": 0
    },

    "requiredMajorCourses": {
      "note": "학교 내규에 따른 전공필수과목 목록을 채워야 합니다.",
      "courses": [
        "CLTR0211", "CLTR0213", "COME0301", "COMP0204", "COMP0205", "COMP0217",
        "COME0331", "COMP0411", "ELEC0462", "COMP0312", "COMP0319", "ITEC0401", "ITEC0402"
      ]
    },

    "basicGeneralEducationCredits": {
      "min": 15,
      "note": "ABEEK 기본소양(전문교양) 최소 15학점 이수"
    },

    "majorBasisCredits": {
      "min": 21,
      "note": "ABEEK 전공기반 최소 18학점 이수"
    },

    "engineeringMajorCredits": {
      "min": 75,
      "note": "ABEEK 공학전공 최소 60학점 이수"
    },


    "capstoneDesignRequirement": {
      "note": "공학전공 학점 내 설계 학점 14학점 이상 필수",
      "minDesignCredits": 14
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점 3학점 이상 이수",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },

    "exitRequirement": {
      "note": "TOPCIT 또는 졸업인터뷰 중 하나를 실시해야 함",
      "options": [
        { "type": "topcit", "note": "TOPCIT 시험 응시", "required": true },
        { "type": "graduation_interview", "note": "졸업 인터뷰 통과", "required": true }
      ]
    }
  },

  "인공지능컴퓨팅전공_인컴_25학번": {
    "trackName": "인공지능컴퓨팅전공 (25학번 기준)",
    "admissionYear": 2025,

    "minTotalCredits": 140,

    "majorCredits": {
      "credits": 72,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0453",
        "COMP0454",
        "COME0331",
        "COMP0324",
        "COMP0319",
        "ITEC0417",
        "ITEC0401"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    "sdgRequirement": {
      "minCredits": 3,
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },
  },
  "인공지능컴퓨팅전공_인컴_24학번": {
    "trackName": "인공지능컴퓨팅전공 (24학번 기준)",
    "admissionYear": 2024,

    "minTotalCredits": 140,

    "majorCredits": {
      "credits": 72,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0453",
        "COMP0454",
        "COME0331",
        "COMP0324",
        "COMP0319",
        "ITEC0417",
        "ITEC0401"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    "sdgRequirement": {
      "minCredits": 3,
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },
  },
  "인공지능컴퓨팅전공_인컴_23학번": {
    "trackName": "인공지능컴퓨팅전공 (23학번 기준)",
    "admissionYear": 2023,

    "minTotalCredits": 140,

    "majorCredits": {
      "credits": 72,
      "note": "다중전공, 해외대학, 대학원, 타 전공학점 제외"
    },

    "requiredMajorCourses": {
      "note": "반드시 이수해야 하는 전공필수과목 목록",
      "courses": [
        "COMP0453",
        "COMP0454",
        "COME0331",
        "COMP0324",
        "COMP0319",
        "ITEC0417",
        "ITEC0401"
      ]
    },

    "generalEducationCredits": {
      "note": "교양 과목은 min 이상 이수해야함",
      "min": 30
    },

    // 첨성인 기초
    "knuBasicRequirement": {
      "readingDebate": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "mathScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    // 첨성인 핵심
    "knuCoreRequirement": {
      "humanitySociety": { "min": 3, "note": "해당 영역 중 3학점 이상" },
      "naturalScience": { "min": 3, "note": "해당 영역 중 3학점 이상" }
    },

    "englishProficiency": {
      "note": "공인영어시험 기준 중 하나 이상을 충족해야 함",
      "options": [
        { "test": "TOEIC", "minScore": 700 },
        { "test": "TOEIC SPEAKING", "minScore": 120 },
        { "test": "PBT", "minScore": 529 },
        { "test": "IBT", "minScore": 71 },
        { "test": "CBT", "minScore": 197 },
        { "test": "TEPS", "minScore": 600 },
        { "test": "TEPS SPEAKING", "minScore": 50 },
        { "test": "OPIC", "minLevel": "IM1" },
        { "test": "G-TELP", "minScore": 65 },
        { "test": "IELTS", "minScore": 6.0 }
      ]
    },

    "internshipRequirement": {
      "note": "현장실습 학점",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상",
      "minRequired": 8
    },
  }
}

module.exports = rules;