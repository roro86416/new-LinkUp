// components/cards/HorizontalCard.tsx
"use client";

interface HorizontalCardProps {
  image: string;
  category?: string;
  title: string;
  description?: string;
  href: string;
}

export default function HorizontalCard({
  image,
  category,
  title,
  description,
  href,
}: HorizontalCardProps) {
  return (
    <a
      href={href}
      className="
        flex gap-6 
        rounded-xl 
        overflow-hidden 
        bg-white 
        border border-neutral-200/30 
        shadow-sm hover:shadow-md 
        transition-all duration-300 
        p-4
      "
    >
      <div className="flex-1">
        {category && (
          <span className="text-xs uppercase text-neutral-600 tracking-wide">
            {category}
          </span>
        )}
        <h3 className="text-xl font-bold mt-1 text-neutral-800">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-600 mt-2">{description}</p>
        )}
      </div>

      <div className="w-40 h-28 overflow-hidden rounded-lg shrink-0">
        <img src={image} className="w-full h-full object-cover" />
      </div>
    </a>
  );
}
