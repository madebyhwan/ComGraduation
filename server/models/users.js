// const mongoose = require('mongoose');

// const usersSchema = new mongoose.Schema({
//   userId:{
//     type: String,
//     required: true, // 필수 항목
//     unique: true,   // 중복 방지
//     trim: true      // 앞뒤 공백 제거
//   },
//   userPassword:{
//     type: String,
//     required: true
//   },
//   username:{
//     type: String,
//     required: true,
//     trim: true
//   },
//   userYear:{
//     type: String,
//     required: true,
//     enum: ['21학번']
//   },
//   userDepartment:{
//     type: String,
//     required: true,
//     enum: ['글로벌SW융합전공', '심화컴퓨터공학전공']
//   },
//   userTrack:{
//     type: String,
//     required: true,
//     enum: ['심컴', '다중전공', '해외복수학위', '학석사연계']
//   },
//   userLectures:[{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Lecture'
//   }],
//   userCustomLectures:[{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'CustomLecture'
//   }]
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('User', usersSchema);

const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // 필수 항목
    unique: true,   // 중복 방지
    trim: true      // 앞뒤 공백 제거
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
    enum: ['21학번'] // (참고: 실제 서비스 시 ['20학번', '21학번', ...] 확장 필요)
  },
  userDepartment: {
    type: String,
    required: true,
    enum: ['글로벌SW융합전공', '심화컴퓨터공학전공'] // (확장 필요)
  },
  userTrack: {
    type: String,
    required: true,
    enum: ['심컴', '다중전공', '해외복수학위', '학석사연계'] // (확장 필요)
  },

  // --- 졸업요건 판별을 위한 필드 ---
  // (이 아랫부분을 추가하세요)

  counselingCount: { // 지도교수 상담
    type: Number,
    default: 0
  },
  passedTopcit: { // TOPCIT 통과 여부
    type: Boolean,
    default: false
  },
  passedInterview: { // 졸업인터뷰 통과 여부
    type: Boolean,
    default: false
  },
  completedInternship: { // 현장실습(인턴십) 이수 여부 (T/F)
    type: Boolean,
    default: false
  },
  startupFounded: { // 창업 여부
    type: Boolean,
    default: false
  },

  // 영어 성적
  toeicScore: {
    type: Number,
    default: 0
  },
  toeflIbtScore: {
    type: Number,
    default: 0
  },
  tepsScore: {
    type: Number,
    default: 0
  },
  opicLevel: { // OPIC 등급 (e.g., "IM1")
    type: String,
    trim: true,
    default: null
  },
  // (checkEnglishProficiency 함수에 정의된 다른 시험들도 필요시 추가)


  // --- 수강 과목 ---

  userLectures: [{ // 학교에서 제공하는 기본 과목
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  userCustomLectures: [{ // 사용자가 직접 추가한 과목
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomLecture'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', usersSchema);