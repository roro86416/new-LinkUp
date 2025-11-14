interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="prose max-w-none mb-16">
      <p>{content}</p>
    </article>
  );
}
