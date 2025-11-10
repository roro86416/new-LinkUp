import Breadcrumb from "../layouts/Breadcrumb";
import PostCard from "../component/posts/postcard"
import { Author } from "../type/author"
interface AuthorPageProps {
  params: { id: string };
}

// 假設你有一個 fetch 函數取得作者資料
async function getAuthorWithPosts(id: string): Promise<Author | null> {
  const res = await fetch(`/api/authors/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const authorId = params.id;
  const author: Author | null = await getAuthorWithPosts(authorId);

  if (!author) return <div>作者不存在</div>;

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb paths={[
          { name: "首頁", href: "/" },
          { name: "文章專區", href: "/article" },
          {name: "作者介紹", href: "/post-author"}
        ]} />

      <h1 className="text-3xl font-bold mt-4">{author.name}</h1>
      <p className="mt-2 text-gray-700">{author.bio}</p>

      <h2 className="text-2xl font-semibold mt-6">投稿文章</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {author.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
