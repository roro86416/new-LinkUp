"use client";
import { useState } from "react";

export default function FilterBar() {
  const [selected, setSelected] = useState("All");

  const filters = ["Event Formats", "Event Types", "Industries"];

  return (
    <div className="flex gap-6 mb-8 border-b pb-4">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setSelected(f)}
          className={`font-medium ${
            selected === f ? "text-black border-b-2 border-black" : "text-gray-500"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
