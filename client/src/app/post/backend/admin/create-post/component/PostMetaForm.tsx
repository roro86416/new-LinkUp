"use client";
import { useState } from "react";

export default function PostMetaForm() {
  const [data, setData] = useState({
    title: "",
    tags: "",
    category: "",
    link: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="border p-6 rounded-xl bg-white shadow-sm flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-700">Post Details</h2>

      <input
        name="title"
        placeholder="Enter post title"
        value={data.title}
        onChange={handleChange}
        className="border p-3 rounded-lg"
      />

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={data.tags}
        onChange={handleChange}
        className="border p-3 rounded-lg"
      />

      <input
        name="category"
        placeholder="Category"
        value={data.category}
        onChange={handleChange}
        className="border p-3 rounded-lg"
      />

      <input
        name="link"
        placeholder="Optional event link"
        value={data.link}
        onChange={handleChange}
        className="border p-3 rounded-lg"
      />
    </div>
  );
}
