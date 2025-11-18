// components/cards/GridCard.tsx
"use client";

interface GridCardProps {
  image: string;
  category?: string;
  title: string;
  href: string;
  author?: string;
  date?: string;
}

export default function GridCard({
  image,
  category,
  title,
  href,
  author,
  date,
}: GridCardProps) {
  return (
    <a
      href={href}
      className="
        block rounded-xl overflow-hidden 
        bg-white 
        border border-neutral-200/30 
        shadow-sm hover:shadow-md 
        transition-all duration-300
      "
    >
      <div className="w-full h-48 overflow-hidden">
        <img src={image} className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        {category && (
          <span className="text-xs text-neutral-600 uppercase tracking-wide">
            {category}
          </span>
        )}

        <h3 className="text-lg font-semibold mt-1 leading-tight text-neutral-800">
          {title}
        </h3>

        {(author || date) && (
          <p className="text-sm text-neutral-500 mt-2">
            {author && `By ${author}`} {date && ` • ${date}`}
          </p>
        )}
      </div>
    </a>
  );
}
