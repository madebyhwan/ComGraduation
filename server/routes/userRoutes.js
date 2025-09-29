const express = require('express');
const router = express.Router();

// controller에서 정의한 함수
const {
  registerUser, loginUser
} = require('../controllers/userController');

// '/api/users' 경로에 대한 라우트 설정
router.post('/register', registerUser); // 회원가입

router.post('/login', loginUser); // 로그인

module.exports = router;