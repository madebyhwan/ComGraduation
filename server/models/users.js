const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true, // 필수 항목
    unique: true,   // 중복 방지
    trim: true      // 앞뒤 공백 제거
  },
  userPassword:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true,
    trim: true
  },
  userYear:{
    type: String,
    required: true,
    enum: ['21학번']
  },
  userDepartment:{
    type: String,
    required: true,
    enum: ['글로벌SW융합전공', '심화컴퓨터공학전공']
  },
  userTrack:{
    type: String,
    required: true,
    enum: ['심컴', '다중전공', '해외복수학위', '학석사연계']
  },
  userLectures:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  userCustomLectures:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomLecture'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', usersSchema);