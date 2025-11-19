import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createPost } from '../api/api.js';

const PostWriteModal = ({ onClose, onPostAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('notice'); // 기본값 공지사항

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.warning('제목과 내용을 입력해주세요.', {
      position: "top-right",
      autoClose: 3000
    });

    try {
      await createPost({ title, content, type });
      toast.success('게시글이 등록되었습니다.', {
        position: "top-right",
        autoClose: 3000
      });
      onPostAdded(); // 목록 새로고침
      onClose();
    } catch (error) {
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