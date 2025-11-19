const router = require('express').Router();
const { getPosts, createPost, deletePost } = require('../controllers/postController');
const authenticateToken = require('../middleware/auth');

// 게시글 목록 조회 (로그인 필요)
router.get('/', authenticateToken, getPosts);

// 게시글 작성
router.post('/', authenticateToken, createPost);

// 게시글 삭제
router.delete('/:postId', authenticateToken, deletePost);

module.exports = router;