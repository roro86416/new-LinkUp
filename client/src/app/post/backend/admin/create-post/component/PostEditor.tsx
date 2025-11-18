"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { v4 as uuid } from "uuid";
import React from "react";

/** --- 定義 block 型別 --- */
type ParagraphBlock = {
  id: string;
  type: "paragraph";
  text: string;
};

type ImageBlock = {
  id: string;
  type: "image";
  url: string;
};

type Block = ParagraphBlock | ImageBlock;

/** 若你有一個整份表單型別，可以改用那個（例如從 zod 推出）：
 *  type PostFormData = z.infer<typeof postSchema>;
 *  然後在 useFormContext<PostFormData>() 就能型別更完整。
 */

/** 這裡我們使用部分表單型別註記，讓 useFieldArray 能正確推斷 */
type FormValues = {
  content: {
    blocks: Block[];
  };
};

export default function PostContentForm() {
  // 告訴 RHF 我們的 form 具有 FormValues（包含 content.blocks）
  const { control, register } = useFormContext<FormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "content.blocks", // 注意：要與父表單的路徑一致
  });

  // 新增段落
  const addParagraph = () => {
    append({
      id: uuid(),
      type: "paragraph",
      text: "",
    } as ParagraphBlock);
  };

  // 新增圖片
  const addImage = (file: File) => {
    const localURL = URL.createObjectURL(file);
    append({
      id: uuid(),
      type: "image",
      url: localURL,
    } as ImageBlock);
  };

  return (
    <div className="border p-6 rounded-xl bg-white shadow-sm flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-700">文章內容</h2>

      <div className="flex flex-col gap-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border rounded-xl p-4 bg-gray-50 relative"
          >
            {/* 操作按鈕 */}
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                className="px-2 py-1 bg-gray-300 text-sm rounded"
                onClick={() => move(index, Math.max(0, index - 1))}
              >
                ↑
              </button>
              <button
                type="button"
                className="px-2 py-1 bg-gray-300 text-sm rounded"
                onClick={() => move(index, Math.min(fields.length - 1, index + 1))}
              >
                ↓
              </button>
              <button
                type="button"
                className="px-2 py-1 bg-red-500 text-white text-sm rounded"
                onClick={() => remove(index)}
              >
                ✕
              </button>
            </div>

            {/* 區塊內容（根據 field.type 分支） */}
            {field.type === "paragraph" && (
              <textarea
                className="w-full border rounded-lg p-3 min-h-[120px]"
                placeholder="Write paragraph..."
                // 注意：register 路徑要對應 content.blocks[index].text
                {...register(`content.blocks.${index}.text` as const)}
                defaultValue={field.type === "paragraph" ? (field as ParagraphBlock).text : ""}
              />
            )}

            {field.type === "image" && (
              <img
                src={(field as ImageBlock).url}
                alt="uploaded image"
                className="w-full rounded-lg"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          onClick={addParagraph}
        >
          + Add Paragraph
        </button>

        <label className="bg-green-600 text-white px-5 py-2 rounded-lg cursor-pointer">
          + Add Image
          <input
            type="file"
            className="hidden"
            onChange={(e) => e.target.files && addImage(e.target.files[0])}
          />
        </label>
      </div>
    </div>
  );
}
