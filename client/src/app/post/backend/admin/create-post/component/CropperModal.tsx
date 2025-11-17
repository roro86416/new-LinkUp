"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-cropper";
import type CropperJS from "cropperjs";
import type { ReactCropperElement } from "react-cropper";
import "../../../style/cropper.css";

// 擴充 CropperJS 型別，包含 options 和 on 方法，用於在 TypeScript 中安全地存取實例屬性
interface CropperInstanceWithOption extends CropperJS {
  options: {
    src: string; 
  };
  on: (event: string, handler: (...args: unknown[]) => void) => void;
}

interface Props {
  file: File | null;
  open: boolean;
  onClose: () => void;
  onCrop: (file: File) => void;
}

export default function CropperModal({ file, open, onClose, onCrop }: Props) {
  // 儲存 React Cropper 元素 (包含 .cropper 屬性)
  const reactCropperRef = useRef<ReactCropperElement | null>(null);

  const [ready, setReady] = useState(false);

  // 創建 Blob URL 用於預覽
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  // 清理 Blob URL 記憶體
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /** 重新嘗試取得 Canvas，避免 null */
  const tryGetCroppedCanvas = async (
    cropper: CropperInstanceWithOption, 
    attempts = 15, 
    wait = 300 
  ): Promise<HTMLCanvasElement | null> => {
    
    // 從實例中安全取得原始 URL
    const sourceUrl = cropper.options.src; 

    for (let i = 0; i < attempts; i++) {
      try {
        const canvas = cropper.getCroppedCanvas({
          width: 1280,
          height: 720,
          fillColor: "#fff",
          imageSmoothingQuality: "high",
        });
        if (canvas) return canvas; 
      } catch {}

      // --- 強化穩定性的步驟：重設狀態並重新載入圖片 ---
      try {
        cropper.reset(); 
        if (sourceUrl) {
            cropper.replace(sourceUrl);
        }
        cropper.crop();
      } catch {}

      await new Promise((res) => setTimeout(res, wait));
    }
    return null; 
  };

  const getCanvasBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) reject(new Error("Failed to create Blob"));
          else resolve(blob);
        },
        "image/jpeg",
        0.92
      );
    });

  /** 執行裁切 */
  const handleCrop = async () => {
    // 從 ref 取得原生的 CropperJS 實例
    const cropper = reactCropperRef.current?.cropper; 
    if (!cropper) return;
    
    // 檢查 ready 狀態
    if (!ready) {
        alert("圖片尚未準備完成，請稍後再試。");
        return;
    }

    // 額外延遲，確保 DOM 完全穩定
    await new Promise((res) => setTimeout(res, 100)); 

    const typedCropper = cropper as CropperInstanceWithOption;

    // 執行最後的穩定性檢查
    try {
        typedCropper.replace(typedCropper.options.src); 
        typedCropper.crop();
    } catch (e) {}

    const canvas = await tryGetCroppedCanvas(typedCropper);
    if (!canvas) {
      alert("圖片尚未準備完成，請稍後再試。");
      return;
    }

    const blob = await getCanvasBlob(canvas);
    const cropped = new File([blob], "cropped.jpg", { type: "image/jpeg" });

    onCrop(cropped);
    onClose();
  };

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-xl w-[90%] max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">裁切封面圖片（16:9）</h2>

        {/* Cropper 容器 */}
        <div className="relative w-full h-[450px] overflow-hidden rounded-lg border bg-gray-200">
          <Cropper
            src={previewUrl}
            className="w-full h-full"
            aspectRatio={16 / 9}
            viewMode={1}
            guides
            background={false}
            responsive
            autoCropArea={1}
            checkOrientation={false}
            ref={reactCropperRef}
            
            // ⭐️ 關鍵：確保 ready 狀態被設定，啟用裁切按鈕
            onInitialized={(instance) => {
              // 在 onInitialized 之後稍作延遲，確保圖片載入完成，並設定 ready 狀態
              setTimeout(() => {
                const cropperInstance = reactCropperRef.current?.cropper;
                if (cropperInstance) {
                    setReady(true);
                }
              }, 50); // 50 毫秒延遲
            }}
          />
        </div>

        {/* 按鈕 */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button" // 避免觸發表單提交
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            取消
          </button>

          <button
            type="button" // 避免觸發表單提交
            onClick={handleCrop}
            disabled={!ready}
            className={`px-4 py-2 text-white rounded-lg transition ${
              ready ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            裁切完成
          </button>
        </div>
      </div>
    </div>
  );
}