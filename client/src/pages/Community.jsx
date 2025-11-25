import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom'; // URL 파라미터 훅
import { toast } from 'react-toastify';
import { getPosts, deletePost, addComment, deleteComment } from '../api/api.js';
import { MessageCircle, Lock, User, Trash2, PenSquare, ArrowLeft, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PostWriteModal from '../components/PostWriteModal';
import { decodeJWT } from '../api/utils';

const Community = () => {
  // [핵심 수정 1] URL 파라미터로 모든 상태 관리 (탭, 게시글ID)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL에서 값 가져오기 (없으면 기본값 'notice')
  // 이제 activeTab은 state가 아니라 URL에 종속된 변수입니다.
  const activeTab = searchParams.get('tab') || 'notice';
  const postIdParam = searchParams.get('postId');

  const [posts, setPosts] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserLoginId, setCurrentUserLoginId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // 관리자 체크
  const isAdmin = () => {
    if (!currentUserLoginId) return false;
    const adminIds = process.env.REACT_APP_ADMIN_IDS?.split(',').map(id => id.trim()) || [];
    return adminIds.includes(currentUserLoginId);
  };

  const isUserAdmin = isAdmin();

  // 1. 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        const id = decoded.id || decoded.userId || decoded._id;
        const userLoginId = decoded.userId; 
        if (id) setCurrentUserId(id);
        if (userLoginId) setCurrentUserLoginId(userLoginId);
      }
    }
  }, []);

  // 2. 게시글 로딩 (URL의 activeTab이 바뀔 때마다 실행됨)
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

  // activeTab 변경 시 검색어 초기화 및 데이터 로딩
  useEffect(() => {
    setSearchKeyword('');
    setSearchInput('');
    setCurrentPage(1);
    fetchPosts();
  }, [fetchPosts]); // activeTab은 fetchPosts의 의존성이므로 포함됨

  // 3. URL에 postId가 있거나 없어질 때 selectedPost 동기화
  useEffect(() => {
    if (postIdParam && posts.length > 0) {
      // URL에 ID가 있으면 해당 글을 찾아서 보여줌
      const post = posts.find(p => p._id === postIdParam);
      if (post) {
        setSelectedPost(post);
      }
    } else {
      // URL에 ID가 없으면(뒤로가기 등) 목록으로 복귀
      setSelectedPost(null);
    }
  }, [postIdParam, posts]);

  // [핵심 수정 2] 탭 변경 핸들러 -> URL만 변경
  const handleTabChange = (newTab) => {
    // 탭을 누르면 해당 탭의 목록으로 이동 (postId 제거)
    setSearchParams({ tab: newTab });
  };

  // [핵심 수정 3] 게시글 클릭 -> URL에 postId 추가
  const handlePostClick = (post) => {
    const authorId = post.author?._id || post.author;
    if (post.isPrivate) {
        const isAuthor = currentUserId && authorId && currentUserId.toString() === authorId.toString();
        if (!isAuthor && !isAdmin()) {
             toast.warning("🔒 비공개 게시글입니다.");
             return;
        }
    }
    // URL 변경 (히스토리에 쌓임 -> 뒤로가기 가능)
    setSearchParams({ tab: activeTab, postId: post._id });
  };

  // 목록으로 돌아가기 버튼
  const handleGoBack = () => {
    setSearchParams({ tab: activeTab }); // postId 제거하여 목록으로
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
      toast.error('댓글 등록 실패');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
      if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
          try {
              const updatedPost = await deleteComment(selectedPost._id, commentId);
              setSelectedPost(updatedPost);
              setPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
              toast.success('댓글이 삭제되었습니다.');
          } catch (error) {
              console.error("댓글 삭제 실패:", error);
              toast.error(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
          }
      }
  };

  // 게시글 수정 (공지사항만)
  const handleEdit = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  // 게시글 삭제
  const handleDelete = async (postId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        toast.success('삭제되었습니다.');
        handleGoBack(); // 목록으로 이동
        fetchPosts();
      } catch (error) {
        console.error('삭제 에러:', error);
        toast.error('삭제 실패');
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
      {/* 헤더 영역 (글쓰기 버튼 제거됨) */}
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-bold">커뮤니티</h1>
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
              <button onClick={handleGoBack} className="mb-4 flex items-center text-gray-500 hover:text-knu-blue transition-colors text-sm font-medium">
                <ArrowLeft size={16} className="mr-1" /> 목록으로
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                {selectedPost.isPrivate && <Lock size={20} className="text-gray-400" />}
                {selectedPost.title}
              </h2>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><User size={14} /> {selectedPost.author?.username || '알 수 없음'}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(selectedPost.createdAt)}</span>
                </div>
                
                {/* 수정/삭제 버튼 */}
                <div className="flex items-center gap-2">
                  {/* 공지사항이고 작성자 본인인 경우 수정 버튼 표시 */}
                  {selectedPost.type === 'notice' && currentUserId && (selectedPost.author?._id || selectedPost.author) && 
                    currentUserId.toString() === (selectedPost.author._id || selectedPost.author).toString() && (
                    <button onClick={() => handleEdit(selectedPost)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                      <PenSquare size={14} /> 수정
                    </button>
                  )}
                  
                  {/* 작성자 본인이거나 관리자면 삭제 버튼 표시 */}
                  {((currentUserId && (selectedPost.author?._id || selectedPost.author) && 
                    currentUserId.toString() === (selectedPost.author._id || selectedPost.author).toString()) || isAdmin()) && (
                    <button onClick={() => handleDelete(selectedPost._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm">
                      <Trash2 size={14} /> 삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-8 border-b border-gray-100 min-h-[200px]">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
            </div>

            {/* 댓글 영역 */}
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
                                                <span className="font-bold text-sm text-gray-800">{comment.author?.username || '알 수 없음'}</span>
                                                <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                                            </div>
                                            
                                            {(isMyComment || isAdmin()) && (
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
                    const authorId = post.author?._id || post.author;
                    const isAuthor = currentUserId && authorId && currentUserId.toString() === authorId.toString();
                    const canViewPrivate = isAuthor || isAdmin();
                    
                    const displayTitle = (post.isPrivate && !canViewPrivate) ? '비공개 게시글' : post.title;
                    
                    return (
                      <li 
                        key={post._id}
                        onClick={() => handlePostClick(post)}
                        className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer text-sm items-center text-center group"
                      >
                        <div className="col-span-1 text-gray-400">{globalIndex}</div>
                        <div className="col-span-7 text-left pl-4 font-medium text-gray-800 truncate pr-2 flex items-center gap-2 group-hover:text-knu-blue transition-colors">
                          {post.isPrivate && <Lock size={14} className="text-gray-400" />}
                          <span className="truncate">{displayTitle}</span>
                          {post.type !== 'notice' && post.comments?.length > 0 && (
                            <span className="text-xs text-knu-blue font-bold bg-blue-50 px-1.5 py-0.5 rounded-full">
                                {post.comments.length}
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 text-gray-600 truncate">{post.author?.username || '알 수 없음'}</div>
                        <div className="col-span-2 text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            {/* [수정] 하단 바: 검색창, 페이지네이션, 글쓰기 버튼 배치 */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                
                {/* 1. 검색창 (좌측) */}
                <form onSubmit={handleSearch} className="flex w-full lg:w-auto gap-2">
                  <div className="relative flex-1 md:w-64">
                    <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="제목 또는 내용으로 검색" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-knu-blue" />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-knu-blue"><Search size={18} /></button>
                  </div>
                </form>

                {/* 2. 페이지네이션 (중앙) */}
                <div className="flex items-center gap-1 justify-center flex-1">
                    {totalPages > 0 && (
                    <>
                        <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
                        <span className="text-sm px-2 font-medium text-gray-600">{currentPage} / {totalPages}</span>
                        <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
                    </>
                    )}
                </div>

                {/* 3. 글쓰기 버튼 (우측) */}
                <div className="w-full lg:w-auto flex justify-end">
                    {(isUserAdmin || activeTab === 'qna') && (
                        <button 
                            onClick={() => setShowWriteModal(true)} 
                            className="rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80 text-sm flex items-center gap-2 whitespace-nowrap"
                        >
                            <PenSquare size={16} />
                            글쓰기
                        </button>
                    )}
                </div>

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
          isAdmin={isAdmin()}
        />
      )}

      {showEditModal && editingPost && (
        <PostWriteModal
          onClose={() => {
            setShowEditModal(false);
            setEditingPost(null);
          }}
          onPostAdded={() => {
            fetchPosts();
            // 수정 후 상세 페이지 새로고침
            if (selectedPost && selectedPost._id === editingPost._id) {
              const updated = posts.find(p => p._id === editingPost._id);
              if (updated) setSelectedPost(updated);
            }
          }}
          editMode={true}
          initialPost={editingPost}
        />
      )}
    </div>
  );
};

export default Community;