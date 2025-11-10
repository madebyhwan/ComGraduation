const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // 필수 항목
    unique: true,   // 중복 방지
    trim: true      // 앞뒤 공백 제거
  },
  userPassword: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  userYear: {
    type: String,
    required: true,
    enum: ['21학번']
  },
  userDepartment: {
    type: String,
    required: true,
    enum: ['글로벌SW융합전공', '심화컴퓨터공학전공']
  },
  userTrack: {
    type: String,
    required: true,
    enum: ['심컴', '다중전공', '해외복수학위', '학석사연계']
  },
  multiMajorType: {
    type: String,
    enum: ['복수전공', '연계전공', '융합전공', '부전공', null],
    default: null
  },
  userLectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  userCustomLectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomLecture'
  }],
  multiMajorLectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  // 영어 성적 정보
  englishTest: {
    testType: {
      type: String,
      enum: ['TOEIC', 'TOEIC SPEAKING', 'PBT', 'IBT', 'CBT', 'TEPS', 'TEPS SPEAKING', 'OPIC', 'G-TELP', 'IELTS', null],
      default: null
    },
    score: {
      type: String,  // OPIC의 경우 IL, IM1 같은 레벨이므로 String
      default: null
    }
  },
  // 졸업 요건 정보
  passedInterview: {
    type: Boolean,
    default: false
  },
  passedTopcit: {
    type: Boolean,
    default: false
  },
  // 기타 정보
  isStartup: {
    type: Boolean,
    default: false
  },
  isExchangeStudent: {
    type: Boolean,
    default: false
  },
  counselingCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', usersSchema);