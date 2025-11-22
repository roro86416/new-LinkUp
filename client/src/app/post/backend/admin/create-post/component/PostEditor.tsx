// PostContentForm.tsx
"use client";

import { useFormContext, useFieldArray, UseFormRegister } from "react-hook-form";
import { v4 as uuid } from "uuid";
import React from "react";
// 引入 Lucide 圖標
import { Plus, Image, AlignLeft, ChevronUp, ChevronDown, X, Trash2, GripVertical } from 'lucide-react'; 

/** --- 定義 block 型別 (不變) --- */
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

type FormValues = {
  content: {
    blocks: Block[];
  };
};

// 輔助元件：顯示區塊內容
const BlockRenderer = React.memo(({ field, index, register }: { field: Block, index: number, register: UseFormRegister<FormValues> }) => {
  return (
    <>
      {/* 段落區塊 - 使用無邊框設計，專注於內容 */}
      {field.type === "paragraph" && (
        <textarea
          // ⭐ 樣式優化: 無邊框， focus 時環形藍色光暈，min-h 增加
          className="w-full bg-white resize-y p-3 sm:p-4 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 rounded-lg transition-all dark:bg-gray-800 dark:text-gray-100"
          placeholder="點擊此處開始寫作段落內容..."
          {...register(`content.blocks.${index}.text` as const)}
          defaultValue={(field as ParagraphBlock).text}
        />
      )}

      {/* 圖片區塊 - 增加陰影和優雅邊框 */}
      {field.type === "image" && (
        <div className="relative w-full overflow-hidden rounded-lg shadow-md">
          <img
            src={(field as ImageBlock).url}
            alt="uploaded image"
            // ⭐ 樣式優化: 圖片置中和適應容器
            className="w-full h-auto object-cover" 
          />
        </div>
      )}
    </>
  );
});

// ⭐ 修正點: 為 React.memo 包裹的元件手動設定 displayName
BlockRenderer.displayName = 'BlockRenderer';

export default function PostContentForm() {
  const { control, register } = useFormContext<FormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "content.blocks",
  });

  const addParagraph = () => {
    append({
      id: uuid(),
      type: "paragraph",
      text: "",
    } as ParagraphBlock);
  };

  const addImage = (file: File) => {
    const localURL = URL.createObjectURL(file);
    append({
      id: uuid(),
      type: "image",
      url: localURL,
    } as ImageBlock);
  };

  return (
    // ⭐ 外層容器優化: 增加更明顯的 shadow-xl，移除內邊框
    <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col gap-6 dark:bg-gray-800">
      
      {/* 標題優化：更粗體，並使用分隔線 */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 pb-3 border-b border-gray-200 dark:border-gray-700">
        文章內容
      </h2>

      {/* 區塊列表 */}
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          // ⭐ 單個區塊容器優化: 移除外框，讓區塊間用間距分隔
          <div
            key={field.id}
            className="group relative p-0 transition-all duration-300 hover:shadow-lg rounded-xl dark:shadow-none"
          >
            
            {/* ⭐ 區塊操作面板優化: 靠左邊懸浮，使用圖標，視覺上更精緻 */}
            <div 
              className={`
                absolute -left-10 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 
                opacity-0 transition-opacity duration-300 group-hover:opacity-100 
                z-10
              `}
            >
              {/* 拖曳圖標 (視覺裝飾) */}
              <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" /> 

              {/* 上移按鈕 */}
              <button
                type="button"
                className={`p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors ${index === 0 ? 'invisible' : ''}`}
                onClick={() => move(index, Math.max(0, index - 1))}
                title="上移區塊"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              
              {/* 下移按鈕 */}
              <button
                type="button"
                className={`p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors ${index === fields.length - 1 ? 'invisible' : ''}`}
                onClick={() => move(index, Math.min(fields.length - 1, index + 1))}
                title="下移區塊"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* 刪除按鈕 - 使用紅色強調 */}
              <button
                type="button"
                className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                onClick={() => remove(index)}
                title="刪除區塊"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* 區塊內容 */}
            <BlockRenderer field={field} index={index} register={register} />

          </div>
        ))}
      </div>
      
      {/* 底部新增按鈕區塊 */}
      <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          // ⭐ 按鈕優化: 使用圖標，更寬的 padding，柔和的藍色調
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md"
          onClick={addParagraph}
        >
          <AlignLeft className="w-5 h-5" />
          新增段落
        </button>

        <label 
          // ⭐ 按鈕優化: 綠色調作為次要動作 (圖片)，樣式與主按鈕一致
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md cursor-pointer"
        >
          <Image className="w-5 h-5" />
          新增圖片
          <input
            type="file"
            className="hidden"
            onChange={(e) => e.target.files && addImage(e.target.files[0])}
            accept="image/*" // 限制只接受圖片檔案
          />
        </label>
      </div>
      
      {/* 當沒有區塊時的 Placeholder */}
      {fields.length === 0 && (
        <div className="text-center py-10 text-gray-400 border border-dashed border-gray-300 rounded-xl dark:border-gray-600">
          <p className="text-lg mb-2">點擊下方的按鈕開始創作您的文章內容</p>
          <p className="text-sm">文章內容將以區塊 (段落、圖片) 的形式組成。</p>
        </div>
      )}

    </div>
  );
}