const Post = require('../models/posts');
const User = require('../models/users');

// 게시글 목록 조회
exports.getPosts = async (req, res) => {
  const { type } = req.query; // 'notice' 또는 'qna' 필터링
  try {
    const query = type ? { type } : {};
    // 작성자 정보를 populate해서 이름 등을 가져옵니다.
    const posts = await Post.find(query)
      .populate('author', 'username userDepartment') 
      .sort({ createdAt: -1 }); // 최신순 정렬

    res.status(200).json(posts);
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 작성
exports.createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, content, type } = req.body;

  if (!title || !content || !type) {
    return res.status(400).json({ message: '모든 항목을 입력해주세요.' });
  }

  try {
    const newPost = await Post.create({
      author: userId,
      title,
      content,
      type
    });
    
    res.status(201).json({ message: '게시글이 등록되었습니다.', post: newPost });
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 작성자 본인인지 확인
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};