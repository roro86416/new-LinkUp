import { Post } from "@/src/app/post/post-component/type/post";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="border rounded p-4 hover:shadow-lg transition">
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-40 object-cover mb-2 rounded"
        />
      )}
      <h3 className="font-semibold">{post.title}</h3>
      <p className="text-gray-600">{post.excerpt}</p>
    </div>
  );
}
