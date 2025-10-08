const router = require('express').Router();

// controller에서 정의한 함수
const {
  registerUser, loginUser
} = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// '/api/users' 경로에 대한 라우트 설정

// 회원가입
router.post('/register', registerUser);

 // 로그인
router.post('/login',loginUser);

// 유저 강의 삭제
router.delete('/deleteLecture/:lectureId', authenticateToken, deleteLecture);

module.exports = router;