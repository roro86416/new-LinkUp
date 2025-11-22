"use client";

import { sanitizeHTML } from "./sanitizeHTML";
import "../../globals.css"

export default function ArticleContent({ content }: { content: string }) {
  const safeHTML = sanitizeHTML(content);

  return (
    <article
      className="prose prose-lg max-w-none prose-img:rounded-lg prose-img:shadow-lg prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7"
      dangerouslySetInnerHTML={{ __html: safeHTML }}
    />
  );
}
