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
        block 
        bg-white 
        border border-neutral-200/30 
        shadow-xl 
        hover:shadow-2xl 
        hover:-translate-y-1 
        transition-all duration-300 ease-in-out

        flex flex-col 
        h-84
        rounded-2xl 
        overflow-hidden
      "
    >
      {/* 🔥 圖片現在直接貼在卡片頂端，不再被 div 阻隔 */}
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-[1.02]"
      />

      <div className="p-5 flex-grow text-center">
        {category && (
          <span
            className="
              inline-block 
              text-xs font-medium 
              text-indigo-700 
              bg-indigo-100 
              rounded-full 
              px-3 py-1 
              uppercase tracking-wider 
              mb-2
            "
          >
            {category}
          </span>
        )}

        <h3 className="text-xl font-semibold mt-1 leading-snug text-neutral-800">
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
