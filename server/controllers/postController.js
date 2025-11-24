const Post = require('../models/posts');
const User = require('../models/users');

// 게시글 목록 조회
exports.getPosts = async (req, res) => {
  const { type } = req.query; // 'notice' 또는 'qna' 필터링
  try {
    const query = type ? { type } : {};
    // 작성자 정보를 populate해서 이름 등을 가져옵니다.
    let posts = await Post.find(query)
      .populate('author', 'username userDepartment') 
      .sort({ createdAt: -1 }); // 최신순 정렬

    // 서버에서는 모든 게시글 데이터를 그대로 반환
    // 클라이언트에서 isAdmin() 함수로 필터링 처리
    res.status(200).json(posts);
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// [수정] 게시글 생성 시 isPrivate 저장하도록 createPost 수정 필요
exports.createPost = async (req, res) => {
  try {
    const { title, content, type, isPrivate } = req.body; // isPrivate 추가
    
    // 공지사항은 관리자만 작성 가능 (userId로 체크)
    if (type === 'notice') {
      const user = await User.findById(req.user.id);
      const adminIds = (process.env.REACT_APP_ADMIN_IDS || '').split(',').map(id => id.trim());
      if (!user || !adminIds.includes(user.userId)) {
        return res.status(403).json({ message: '공지사항은 관리자만 작성할 수 있습니다.' });
      }
    }
    
    const newPost = await Post.create({
      title,
      content,
      type,
      isPrivate: isPrivate || false, // 없으면 false
      author: req.user.id
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: '게시글 등록 실패' });
  }
};
// [추가] 댓글 작성 함수
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    const newComment = {
      content,
      author: req.user.id,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();
    
    // 댓글 작성자 정보를 포함해서 반환하기 위해 populate 수행
    const updatedPost = await Post.findById(postId)
        .populate('author', 'username userDepartment')
        .populate('comments.author', 'username userDepartment');

    res.status(200).json(updatedPost); // 업데이트된 게시글 전체 반환
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '댓글 등록 실패' });
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

// [추가] 댓글 삭제 함수
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id; // auth 미들웨어에서 설정된 user id

  try {
    // 1. 게시글 찾기
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 2. 댓글 찾기 (Mongoose의 id() 메서드 활용)
    const comment = post.comments.id(commentId);
    if (!comment) {
        return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    // 3. 권한 확인 (댓글 작성자 본인인지)
    if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: '댓글 삭제 권한이 없습니다.' });
    }

    // 4. 댓글 삭제 (Mongoose의 pull() 메서드 활용)
    post.comments.pull(commentId);
    await post.save();

    // 5. 업데이트된 게시글 정보 반환 (작성자 정보 포함 populate)
    const updatedPost = await Post.findById(postId)
        .populate('author', 'username userDepartment')
        .populate('comments.author', 'username userDepartment');

    res.status(200).json(updatedPost);

  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다.' });
  }
};