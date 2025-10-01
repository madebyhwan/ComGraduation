const router = require('express').Router();
const {
    searchLecture
} = require('../controllers/lectureController');

// '/api/lectures' 경로에 대한 라우트 설정
router.post('/search', searchLecture); // 강의 검색

module.exports = router;