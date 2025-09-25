const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  LECT_NAME: {
    type: String,
    required: true,
    trim: true
  },
  LECT_CODE: {
    type: String,
    match: /^[A-Z]{4}[0-9]{4}$/
  },
  LECT_DIV: {
    type: String,
    match: /^[0-9]{3}$/
  },
  LECT_CREDIT: {
    type: Number,
    required: true,
    min: 1
  },
  LECT_YEAR: {
    type: Number,
    required: true
  },
  LECT_SEMESTER: {
    type: String,
    enum: ['1학기', '2학기', '계절학기(하계)', '계절학기(동계)'],
    required: true
  },
  LECT_PROF: {
    type: String,
    trim: true
  },
  LECT_TIME: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lecture', lectureSchema);