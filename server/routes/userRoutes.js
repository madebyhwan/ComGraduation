const router = require('express').Router();

// controller에서 정의한 함수
const {
  registerUser, loginUser,
  deleteLecture,
  addUnivLecture,
  checkIdDuplication,
  checkGraduation,
  addCustomLecture,
  getLecture,
  getUserProfile,
  updateUserProfile,
  tossMultiMajorLectures
} = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// '/api/users' 경로에 대한 라우트 설정

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

// 유저 강의 삭제
router.delete('/deleteLecture/:lectureId', authenticateToken, deleteLecture);

// 아이디 중복 확인
router.get('/checkId', checkIdDuplication);

// 강의계획서 강의 추가 
router.post('/addUnivLect', authenticateToken, addUnivLecture);

// 졸업요건 확인 경로 추가
router.get('/graduation', authenticateToken, checkGraduation);
// 사용자 정의 강의 추가
router.post('/addCustomLect', authenticateToken, addCustomLecture);

// 강의 불러오기
router.get('/getLecture', authenticateToken, getLecture);

// 사용자 정보 조회 (내 정보 페이지 진입 시)
router.get('/profile', authenticateToken, getUserProfile);

// 사용자 정보 수정 (내 정보 수정 후 저장 버튼 클릭 시)
router.patch('/profile', authenticateToken, updateUserProfile);

// 복수/연계/융합/부전공 트랙 선택
router.post('/tossMultiMajorLectures', authenticateToken, tossMultiMajorLectures);

module.exports = router;