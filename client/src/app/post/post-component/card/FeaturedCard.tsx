"use client";

interface FeaturedCardProps {
  image: string;
  category?: string;
  title: string;
  description?: string;
  href: string;
  className?: string;
}

export default function FeaturedCard({
  image,
  category,
  title,
  description,
  href,
  className = "",
}: FeaturedCardProps) {
  return (
    <a
      href={href}
      className={`
        relative block rounded-2xl overflow-hidden 
        border border-neutral-200/30
        shadow-sm hover:shadow-md 
        transition-all duration-500
        ${className}
      `}
    >
      <img
        src={image}
        className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

      <div className="absolute bottom-6 left-6 text-white">
        {category && (
          <span className="text-xs uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
            {category}
          </span>
        )}
        <h2 className="text-2xl font-bold mt-2">{title}</h2>
        {description && (
          <p className="text-sm mt-1 max-w-md opacity-90">{description}</p>
        )}
      </div>
    </a>
  );
}
