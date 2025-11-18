import React, { useState, useEffect, useCallback } from 'react';
import { getPosts, deletePost } from '../api/api.js';
import { /*MessageSquare,*/ User, Trash2, PenSquare } from 'lucide-react';
import PostWriteModal from '../components/PostWriteModal';
import { decodeJWT } from '../api/utils';

const Community = () => {
  const [activeTab, setActiveTab] = useState('notice'); // 'notice' | 'qna'
  const [posts, setPosts] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && (decoded.id || decoded.userId || decoded._id)) {
        setCurrentUserId(decoded.id || decoded.userId || decoded._id);
      }
    }
  }, []);

  // 2. 게시글 불러오기
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPosts(activeTab);
      setPosts(data);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 3. 게시글 삭제 핸들러
  const handleDelete = async (postId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        alert('삭제되었습니다.');
        fetchPosts();
      } catch (error) {
        console.error('삭제 에러:', error);
        alert('삭제 실패');
      }
    }
  };

  // 날짜 포맷팅 함수 (YYYY. MM. DD. HH:mm)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // 24시간제 (오전/오후 표시 원하면 true로 변경)
    });
  };

  return (
    <div>
      {/* 1. 제목 폰트 & 마진 통일 (Courses.jsx와 동일) */}
      <h1 className="text-3xl font-bold mb-6">커뮤니티</h1>

      {/* 탭 메뉴 (LecSearch 위치와 비슷하게 배치) */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          className={`pb-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'notice'
              ? 'text-knu-blue border-b-2 border-knu-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('notice')}
        >
          📢 공지사항
        </button>
        <button
          className={`pb-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'qna'
              ? 'text-knu-blue border-b-2 border-knu-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('qna')}
        >
          ❓ Q&A
        </button>
      </div>

      {/* 2. 흰색 박스 디자인 (LectureList 스타일 완벽 적용) */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200">
        {/* 박스 헤더 (LectureList의 p-5 헤더와 동일) */}
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold select-none">
              {activeTab === 'notice' ? '공지사항 목록' : 'Q&A 목록'}
            </h3>
            <span className="text-sm text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
              {posts.length}건
            </span>
          </div>

          {/* 글쓰기 버튼 (LectureList의 추가 버튼 스타일) */}
          <button
            onClick={() => setShowWriteModal(true)}
            className="rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80 text-sm flex items-center gap-2"
          >
            <PenSquare size={16} />
            글쓰기
          </button>
        </div>

        {/* 목록 영역 (LectureList의 p-6 본문 영역과 동일) */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-4 text-gray-500">로딩 중...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              등록된 게시글이 없습니다.
            </div>
          ) : (
            <ul className="space-y-2"> {/* 리스트 간격 조정 */}
              {posts.map((post) => {
                const authorId = post.author?._id || post.author;
                const isMyPost =
                  currentUserId &&
                  authorId &&
                  currentUserId.toString() === authorId.toString();

                return (
                  <li
                    key={post._id}
                    // LectureList의 li 스타일 (p-3, rounded-lg, hover효과) 적용
                    className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1 pr-4">
                      {/* 제목 */}
                      <p className="font-semibold text-gray-800 mb-1">
                        {post.title}
                      </p>
                      
                      {/* 내용 */}
                      <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-wrap mb-2">
                        {post.content}
                      </p>

                      {/* 하단 정보 */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                           <User size={12} />
                           {post.author?.username || '익명'}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    {/* 삭제 버튼 */}
                    {isMyPost && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post._id);
                        }}
                        title="삭제"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors mt-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWriteModal
          onClose={() => setShowWriteModal(false)}
          onPostAdded={fetchPosts}
        />
      )}
    </div>
  );
};

export default Community;