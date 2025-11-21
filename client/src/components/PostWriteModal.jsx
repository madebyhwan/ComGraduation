import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createPost } from '../api/api.js';
import { Lock } from 'lucide-react';

const PostWriteModal = ({ onClose, onPostAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('notice'); // 기본값 공지사항
  // [추가] 비밀글 상태
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.warning('제목과 내용을 입력해주세요.', {
      position: "top-right",
      autoClose: 3000
    });

   try {
      // isPrivate 필드도 함께 전송
      await createPost({ title, content, type, isPrivate });
      toast.success('게시글이 등록되었습니다.', {
        position: "top-right",
        autoClose: 3000
      });
      onPostAdded(); // 목록 새로고침
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('게시글 등록 실패', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4">게시글 작성</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">게시판 선택</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="type" value="notice" 
                  checked={type === 'notice'} 
                  onChange={(e) => setType(e.target.value)} 
                />
                공지사항
              </label>
             <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="type" value="qna" 
                  checked={type === 'qna'} 
                  onChange={(e) => setType(e.target.value)} 
                />
                Q&A
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 h-32 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          {/* [수정] 비밀글 체크박스 (Q&A일 때만 표시) */}
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

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostWriteModal;