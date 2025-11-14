"use client";
import { useState } from "react";

export default function CommentSection() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === "") return;
    setComments([...comments, comment]);
    setComment("");
  };

  return (
    <section className="border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-2 mb-2"
          placeholder="Leave a comment..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Post
        </button>
      </form>

      <ul>
        {comments.map((c, i) => (
          <li key={i} className="border-b py-2">
            {c}
          </li>
        ))}
      </ul>
    </section>
  );
}
