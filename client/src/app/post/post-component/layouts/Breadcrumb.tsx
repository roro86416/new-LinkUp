"use client";
import Link from "next/link";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";

export default function Breadcrumb() {
  const breadcrumbs = useBreadcrumb();

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500">
      <Link href="/" className="hover:text-gray-800">
        Home
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span>/</span>
          <Link
            href={crumb.href}
            className={`hover:text-gray-800 ${
              index === breadcrumbs.length - 1 ? "font-semibold" : ""
            }`}
          >
            {crumb.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}

