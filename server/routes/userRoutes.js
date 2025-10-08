const router = require('express').Router();
const authenticateToken = require('../middleware/auth');

// controller에서 정의한 함수
const {
  registerUser, loginUser,
  addUnivLecture,
  checkIdDuplication,
  checkGraduation
} = require('../controllers/userController');

// '/api/users' 경로에 대한 라우트 설정

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

// 아이디 중복 확인
router.get('/checkId', checkIdDuplication);

// 강의계획서 강의 추가 
router.post('/addUnivLect', authenticateToken, addUnivLecture);

// 졸업요건 확인 경로 추가
router.get('/graduation', authenticateToken, checkGraduation);

module.exports = router;