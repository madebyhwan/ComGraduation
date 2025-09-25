// 예시 코드
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   studentId: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   email: { type: String, required: true },
//   name: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  USER_NAME: {
    type: String,
    required: true,
    trim: true
  },
  USER_CODE: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  USER_PASSWORD: {
    type: String,
    required: true
  },
  USER_DEPARTMENT: {
    type: String,
    enum: ['글로벌SW융합전공', '심화컴퓨터공학전공'],
    required: true
  },
  USER_TRACK: {
    type: String,
    enum: ['심컴', '다중전공', '해외복수학위', '학석사연계'],
    required: true
  },
  USER_LECTURES: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);