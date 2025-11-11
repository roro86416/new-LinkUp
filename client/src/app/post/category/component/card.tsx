interface CardProps {
  title: string;
  category: string;
  image: string;
}

export default function Card({ title, category, image }: CardProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
          {category}
        </span>
        <h3 className="mt-3 font-bold text-lg">{title}</h3>
      </div>
    </div>
  );
}
