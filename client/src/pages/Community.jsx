import React, { useState, useEffect, useCallback } from 'react';
import { getPosts, deletePost, addComment, deleteComment } from '../api/api.js';
import { MessageCircle, Lock, User, Trash2, PenSquare, ArrowLeft, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PostWriteModal from '../components/PostWriteModal';
import { decodeJWT } from '../api/utils';

const Community = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const [posts, setPosts] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  // 페이지네이션 및 검색
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        // 토큰 구조에 따라 id 필드 확인
        const id = decoded.id || decoded.userId || decoded._id;
        if (id) setCurrentUserId(id);
      }
    }
  }, []);

  // 게시글 로딩
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

  // 탭 변경 시 상태 초기화
  useEffect(() => {
    setSelectedPost(null);
    setSearchKeyword('');
    setSearchInput('');
    setCurrentPage(1);
    fetchPosts();
  }, [fetchPosts]);

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    if (activeTab !== tab) {
        setActiveTab(tab);
    } else {
        setSelectedPost(null);
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      const updatedPost = await addComment(selectedPost._id, { content: commentContent });
      setSelectedPost(updatedPost); 
      setCommentContent('');
      setPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
    } catch (error) {
      alert('댓글 등록 실패');
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
      if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
          try {
              // API 호출
              const updatedPost = await deleteComment(selectedPost._id, commentId);
              
              // 현재 보고 있는 상세글 상태 업데이트
              setSelectedPost(updatedPost);
              
              // 뒤에 있는 목록 데이터도 업데이트 (댓글 개수 동기화 등)
              setPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
              
              alert('댓글이 삭제되었습니다.');
          } catch (error) {
              console.error("댓글 삭제 실패:", error);
              alert(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
          }
      }
  };

  // ... render ...
  // (댓글 렌더링 부분에서 handleDeleteComment(comment._id) 연결 확인)


  // 게시글 클릭 (비밀글 권한 체크)
  const handlePostClick = (post) => {
    const authorId = post.author?._id || post.author;
    if (post.isPrivate) {
        if (!currentUserId || (authorId && currentUserId.toString() !== authorId.toString())) {
             alert("🔒 비공개 게시글입니다.");
             return;
        }
    }
    setSelectedPost(post);
  };

  // 게시글 삭제
  const handleDelete = async (postId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        alert('삭제되었습니다.');
        setSelectedPost(null);
        fetchPosts();
      } catch (error) {
        console.error('삭제 에러:', error);
        alert('삭제 실패');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter((post) => {
    if (!searchKeyword) return true;
    const lowerKeyword = searchKeyword.toLowerCase();
    return post.title.toLowerCase().includes(lowerKeyword) || post.content.toLowerCase().includes(lowerKeyword);
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-bold">커뮤니티</h1>
        {!selectedPost && (
          <button onClick={() => setShowWriteModal(true)} className="rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80 text-sm flex items-center gap-2">
            <PenSquare size={16} />
            글쓰기
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'notice' ? 'text-knu-blue border-b-2 border-knu-blue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('notice')}
        >
          📢 공지사항
        </button>
        <button
          className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'qna' ? 'text-knu-blue border-b-2 border-knu-blue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('qna')}
        >
          ❓ Q&A
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[500px] flex flex-col">
        
        {selectedPost ? (
          <div className="animate-fadeIn flex-1 flex flex-col">
            {/* 상세 보기 헤더 */}
            <div className="p-6 border-b border-gray-100">
              <button onClick={() => setSelectedPost(null)} className="mb-4 flex items-center text-gray-500 hover:text-knu-blue transition-colors text-sm font-medium">
                <ArrowLeft size={16} className="mr-1" /> 목록으로
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                {selectedPost.isPrivate && <Lock size={20} className="text-gray-400" />}
                {selectedPost.title}
              </h2>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><User size={14} /> {selectedPost.author?.username || '익명'}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(selectedPost.createdAt)}</span>
                </div>
                {(currentUserId && (selectedPost.author?._id || selectedPost.author) && currentUserId.toString() === (selectedPost.author._id || selectedPost.author).toString()) && (
                  <button onClick={() => handleDelete(selectedPost._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm">
                    <Trash2 size={14} /> 삭제
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-8 border-b border-gray-100 min-h-[200px]">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
            </div>

            {/* 댓글 영역 (공지사항 제외) */}
            {selectedPost.type !== 'notice' && (
                <div className="p-8 bg-gray-50 flex-1">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MessageCircle size={20} />
                        답변 <span className="text-knu-blue">{selectedPost.comments?.length || 0}</span>
                    </h3>

                    <div className="space-y-4 mb-6">
                        {selectedPost.comments && selectedPost.comments.length > 0 ? (
                            selectedPost.comments.map((comment, idx) => {
                                const commentAuthorId = comment.author?._id || comment.author;
                                const isMyComment = currentUserId && commentAuthorId && currentUserId.toString() === commentAuthorId.toString();

                                return (
                                    <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-gray-800">{comment.author?.username || '익명'}</span>
                                                <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                                            </div>
                                            
                                            {/* 댓글 삭제 버튼 (본인 작성글일 때) */}
                                            {isMyComment && (
                                                <button 
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                                    title="댓글 삭제"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm pl-1">아직 등록된 답변이 없습니다.</p>
                        )}
                    </div>

                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <input 
                            type="text" 
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="답변을 입력하세요..."
                            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-knu-blue"
                        />
                        <button type="submit" className="bg-knu-blue text-white px-4 py-2 rounded-md hover:bg-opacity-90 font-medium text-sm whitespace-nowrap shadow-sm">
                            등록
                        </button>
                    </form>
                </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600 text-center">
                <div className="col-span-1">번호</div>
                <div className="col-span-7 text-left pl-4">제목</div>
                <div className="col-span-2">작성자</div>
                <div className="col-span-2">작성일</div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-gray-500">로딩 중...</div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">{searchKeyword ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {currentPosts.map((post, index) => {
                    const globalIndex = filteredPosts.length - (indexOfFirstPost + index);
                    return (
                      <li 
                        key={post._id}
                        onClick={() => handlePostClick(post)}
                        className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer text-sm items-center text-center group"
                      >
                        <div className="col-span-1 text-gray-400">{globalIndex}</div>
                        <div className="col-span-7 text-left pl-4 font-medium text-gray-800 truncate pr-2 flex items-center gap-2 group-hover:text-knu-blue transition-colors">
                          {post.isPrivate && <Lock size={14} className="text-gray-400" />}
                          <span className="truncate">{post.title}</span>
                          {post.type !== 'notice' && post.comments?.length > 0 && (
                            <span className="text-xs text-knu-blue font-bold bg-blue-50 px-1.5 py-0.5 rounded-full">
                                {post.comments.length}
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 text-gray-600 truncate">{post.author?.username || '익명'}</div>
                        <div className="col-span-2 text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
                  <div className="relative flex-1 md:w-64">
                    <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="제목 또는 내용으로 검색" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-knu-blue" />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-knu-blue"><Search size={18} /></button>
                  </div>
                </form>
                {totalPages > 0 && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
                    <span className="text-sm px-2 font-medium text-gray-600">{currentPage} / {totalPages}</span>
                    <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showWriteModal && (
        <PostWriteModal
          onClose={() => setShowWriteModal(false)}
          onPostAdded={fetchPosts}
          initialTab={activeTab}
        />
      )}
    </div>
  );
};

export default Community;