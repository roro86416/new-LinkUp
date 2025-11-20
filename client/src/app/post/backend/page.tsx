'use client';
// backend/page.tsx
import { redirect } from "next/navigation";

export default function BackendHomePage() {
  redirect("/post/backend/admin/create-post");
}
