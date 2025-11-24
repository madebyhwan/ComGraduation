const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 작성자 정보 (User 모델 참조)
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['notice', 'qna'], // 공지사항(notice) 또는 Q&A(qna)
    default: 'qna',
    required: true
  },
  // [추가] 비밀글 여부 (기본값 false)
  isPrivate: { type: Boolean, default: false },
  
  // [추가] 댓글(답변) 목록
  comments: [{
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

module.exports = mongoose.model('Post', postsSchema);