const router = require('express').Router();

// controller에서 정의한 함수
const {
  registerUser, loginUser,
  deleteLecture,
  addUnivLecture,
  checkIdDuplication,
  addCustomLecture,
  getLecture
} = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// '/api/users' 경로에 대한 라우트 설정

// 회원가입
router.post('/register', registerUser);

 // 로그인
router.post('/login',loginUser);

// 유저 강의 삭제
router.delete('/deleteLecture/:lectureId', authenticateToken, deleteLecture);

// 아이디 중복 확인
router.get('/checkId', checkIdDuplication);

// 강의계획서 강의 추가 
router.post('/addUnivLect', authenticateToken, addUnivLecture);

// 사용자 정의 강의 추가
router.post('/addCustomLect', authenticateToken, addCustomLecture);

// 강의 불러오기
router.get('/getLecture', authenticateToken, getLecture);

module.exports = router;