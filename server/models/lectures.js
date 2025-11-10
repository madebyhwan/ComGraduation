const mongoose = require('mongoose');

const lecturesSchema = new mongoose.Schema({
  lectName: {
    type: String,
    required: true, // 필수 항목
    trim: true      // 앞뒤 공백 제거
  },
  lectCode: {  // 사용자의 직접 입력을 위해 required 삭제
    type: String,
    match: /^[A-Z]{4}[0-9]{4}$/,
    trim: true
  },
  lectDiv: {   // 사용자의 직접 입력을 위해 required 삭제
    type: String,
    match: /^[0-9]{3}$/,
    trim: true
  },
  lectCredit: {
    type: Number,
    required: true,
    min: 1
  },
  lectYear: {  // 사용자의 직접 입력을 위해 required 삭제
    type: Number,
    enum: [2021, 2022, 2023, 2024, 2025]
  },
  lectSemester: {  // 사용자의 직접 입력을 위해 required 삭제
    type: String,
    enum: ['1학기', '2학기', '계절학기(하계)', '계절학기(동계)']
  },
  lectProfessor: {
    type: String,
    trim: true
  },
  lectGeneral: {
    type: String,
    required: true
  },
  lectTime: {
    type: String
  },
  lectDepartment: {
    type: String
  },
  isEnglishlecture: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lecture', lecturesSchema);