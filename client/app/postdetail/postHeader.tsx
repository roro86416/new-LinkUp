import Image from "next/image";
import Link from "next/link";

interface ArticleHeaderProps {
  article: {
    title: string;
    image: string;
    createdAt: string;
    author: { name: string; id: number };
    category: { name: string; id: number };
    tags: { name: string }[];
    eventLink?: string;
  };
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="bg-green-100 p-6 rounded-xl mb-10 flex flex-col lg:flex-row items-center lg:items-start gap-6">
      <div className="flex-1">
        <div className="text-sm font-semibold uppercase mb-3">
          <Link
            href={`/categories/${article.category.id}`}
            className="px-2 py-1 border rounded-full hover:bg-green-200"
          >
            {article.category.name}
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold mb-4">{article.title}</h1>

        <div className="text-sm text-gray-700 mb-3 flex flex-wrap items-center gap-2">
          <Link
            href={`/authors/${article.author.id}`}
            className="hover:underline font-semibold"
          >
            {article.author.name}
          </Link>
          <span>• {formatDate(article.createdAt)}</span>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {article.tags.map((tag, i) => (
            <Link
              key={i}
              href={`/tags/${tag.name.toLowerCase()}`}
              className="px-3 py-1 border rounded-full text-sm hover:bg-green-200"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        {article.eventLink && (
          <Link
            href={article.eventLink}
            className="inline-block mt-2 text-blue-600 hover:underline"
          >
            View Event →
          </Link>
        )}
      </div>

      <div className="relative w-full lg:w-[400px] h-[250px] rounded-lg overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
