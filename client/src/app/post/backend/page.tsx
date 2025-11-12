'use client';
// backend/page.tsx
import { redirect } from "next/navigation";

export default function BackendHomePage() {
  redirect("/backend/admin/create-post");
}
