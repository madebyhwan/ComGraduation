const mongoose = require('mongoose');

const customLecuteresSchema = new mongoose.Schema({
  userObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lectName: {
    type: String,
    required: true,
    trim: true
  },
  lectType: {
    type: String,
    enum: ['전공', '교양', '일반선택'],
    required: true
  },
  lectCode: {  // 사용자의 직접 입력을 위해 required 삭제
    type: String,
    match: /^[A-Z]{4}[0-9]{4}$/,
    trim: true
  },
  overseasCredit: {  // 해외학점
    type: Number,
    min: 0,
    required: true
  },
  fieldPracticeCredit: {  // 현장실습학점
    type: Number,
    min: 0,
    required: true
  },
  startupCourseCredit: {  // 창업교과목학점
    type: Number,
    min: 0,
    required: true
  },
  totalCredit: {  // 총 이수학점에 포함되는 학점
    type: Number,
    min: 0,
    required: true
  },
  isEnglishLecture: {
    type: Boolean,
    default: false
  },
  isSDGLecture: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomLecture', customLecuteresSchema, 'customLectures');