// components/CommentSection.tsx
"use client";
import React, { useState, FormEvent } from 'react';

// 留言板元件 (簡化版本)
const CommentSection: React.FC = () => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  // 假設留言數據
  const [comments, setComments] = useState([
    { id: 1, name: '王小明', date: '2025/11/20', content: '這篇文章寫得真好，給我很多啟發！' },
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText || !authorName) return;

    // TODO: 這裡應該發送 POST 請求到您的 Next.js API Route (例如: /api/comments)
    console.log(`提交留言: ${authorName} - ${commentText}`);

    // 暫時模擬新增到列表 (實際應該是 API 成功回應後更新)
    const newComment = {
      id: Date.now(),
      name: authorName,
      date: new Date().toLocaleDateString('zh-TW'),
      content: commentText,
    };
    setComments([...comments, newComment]);
    setCommentText('');
    setAuthorName('');
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900">
        讀者留言 ({comments.length})
      </h2>

      {/* 留言輸入表單 */}
      <form onSubmit={handleSubmit} className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-xl font-bold mb-4">發表您的看法</h3>
        <input
          type="text"
          placeholder="您的暱稱 (必填)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          required
        />
        <textarea
          placeholder="請輸入您的留言..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={4}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-150 shadow-md"
        >
          提交留言
        </button>
      </form>

      {/* 留言列表 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">{comment.name}</span>
              <span className="text-sm text-gray-500">{comment.date}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;