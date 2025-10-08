const mongoose = require('mongoose');

const customLecuteresSchema = new mongoose.Schema({
  userObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
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
    enum: ['해외학점', '창업학점', '현장실습학점'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomLecture', customLecuteresSchema);