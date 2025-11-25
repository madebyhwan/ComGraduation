import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createPost, updatePost } from '../api/api.js';
import { Lock } from 'lucide-react';

// [수정 1] isAdmin을 props로 받음 (부모 컴포넌트에서 전달)
const PostWriteModal = ({ onClose, onPostAdded, initialTab, editMode = false, initialPost = null, isAdmin }) => {
  const [title, setTitle] = useState(editMode ? initialPost?.title || '' : '');
  const [content, setContent] = useState(editMode ? initialPost?.content || '' : '');

  // [수정 2] 초기 타입 설정 로직 간소화
  // 관리자라면 initialTab을 따르고, 일반 회원이면 무조건 'qna'
  const [type, setType] = useState(isAdmin ? (initialTab || 'notice') : 'qna');
  const [isPrivate, setIsPrivate] = useState(editMode ? initialPost?.isPrivate || false : false);

  // type이 변경될 때마다 notice면 비밀글 해제
  useEffect(() => {
    if (type === 'notice') {
      setIsPrivate(false);
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.warning('제목과 내용을 입력해주세요.', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    try {
      if (editMode && initialPost) {
        // 수정 모드 (isPrivate도 수정 가능하게 포함)
        await updatePost(initialPost._id, { title, content, type, isPrivate });
        toast.success('게시글이 수정되었습니다.', {
          position: "top-right",
          autoClose: 3000
        });
      } else {
        // 작성 모드
        await createPost({ title, content, type, isPrivate });
        toast.success('게시글이 등록되었습니다.', {
          position: "top-right",
          autoClose: 3000
        });
      }
      onPostAdded(); // 목록 새로고침
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(editMode ? '게시글 수정 실패' : '게시글 등록 실패', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 transform transition-all">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {editMode ? '게시글 수정' : '게시글 작성'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* [수정 3] 게시판 선택 영역: 관리자(isAdmin)일 때만 보여줌 */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">게시판 선택</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="notice" 
                    checked={type === 'notice'} 
                    onChange={(e) => setType(e.target.value)} 
                    className="text-knu-blue focus:ring-knu-blue"
                  />
                  <span className="text-gray-700">공지사항</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="qna" 
                    checked={type === 'qna'} 
                    onChange={(e) => setType(e.target.value)} 
                    className="text-knu-blue focus:ring-knu-blue"
                  />
                  <span className="text-gray-700">Q&A</span>
                </label>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-knu-blue focus:ring-1 focus:ring-knu-blue outline-none transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 h-40 resize-none focus:border-knu-blue focus:ring-1 focus:ring-knu-blue outline-none transition-colors"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          {/* 비밀글 체크박스: Q&A일 때만 표시 */}
          {type === 'qna' && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-100">
              <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-knu-blue rounded border-gray-300 focus:ring-knu-blue"
              />
              <label htmlFor="isPrivate" className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <Lock size={14} />
                비공개 글 (작성자와 관리자만 볼 수 있습니다)
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-knu-blue text-white rounded-md hover:bg-opacity-90 transition-colors font-medium shadow-sm"
            >
              {editMode ? '수정하기' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostWriteModal;