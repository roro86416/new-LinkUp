import Link from "next/link";

interface BreadcrumbProps {
  paths: { name: string; href: string }[];
}

export default function Breadcrumb({ paths }: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-500 mb-6">
      {paths.map((path, i) => (
        <span key={i}>
          <Link href={path.href} className="hover:underline">
            {path.name}
          </Link>
          {i < paths.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
}
