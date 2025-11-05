const rules = {
  "글로벌SW융합전공_다중전공_21학번": {
    "trackName": "다중전공트랙 (21학번 기준)",
    "admissionYear": 2021,

    "minTotalCredits": 130,

    "minMajorCredits": {
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
      "min": 24,
      "max": 42
    },

    "globalCompetency": {
      "minOverseasCredits": 9
    },

    "internshipRequirement": {
      "note": "인턴십 이수 여부 (필수)",
      "required": true
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
    // "swConvergenceCompetency": {
    //   "required": false,
    //   "note": "종합설계교과목은 22학번부터 필수"
    // },

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
      "note": "인턴십 학점 및 이수 요건",
      "minInternshipCredits": 3
    },

    "counselingSessions": {
      "note": "지도교수 상담 8회 이상 충족 필요",
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
  }
}

module.exports = rules;