const rules = {
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
      "note": "아래 공인영어시험 기준 중 하나 이상을 충족해야 함",
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
      "note": "아래 공인영어시험 기준 중 하나 이상을 충족해야 함",
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
      "note": "아래 공인영어시험 기준 중 하나 이상을 충족해야 함",
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
      "note": "아래 공인영어시험 기준 중 하나 이상을 충족해야 함",
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
      "note": "아래 공인영어시험 기준 중 하나 이상을 충족해야 함",
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
      "note": "아래 공인영어시험 기준 중 하나 이상을 충족해야 함",
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
      "note": "아래 공인영어시험 기준 중 하나 이상을 충족해야 함",
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
}
module.exports = rules;