const mongoose = require('mongoose');

const customLecuteresSchema = new mongoose.Schema({
  userObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lectName:{
    type: String,
    required: true,
    trim: true
  },
  lectCredit:{
    type: Number,
    required: true,
    min: 1
  },
  lectType:{
    type: String,
    enum: ['전공', '전공필수', '교양', '일반선택'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomLecture', customLecuteresSchema, 'customLectures');