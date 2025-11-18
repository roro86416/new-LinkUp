interface PostCardProps {
  post: {
    id: string;
    title: string;
    coverImage: string;
    category: string;
    tags: string[];
    createdAt: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-40 object-cover rounded"
      />

      <h2 className="text-xl font-semibold mt-4">{post.title}</h2>

      <p className="text-sm text-gray-500 mt-1">
        類別：{post.category}．{post.createdAt}
      </p>

      <div className="flex gap-2 mt-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-200 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 動作按鈕 */}
      <div className="flex justify-between mt-4">
        <a
          href={`/dashboard/posts/${post.id}/edit`}
          className="text-blue-600 hover:underline"
        >
          編輯
        </a>

        <button className="text-red-500 hover:underline">
          刪除
        </button>
      </div>
    </div>
  );
}
