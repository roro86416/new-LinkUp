"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-cropper";
import type CropperJS from "cropperjs";
import type { ReactCropperElement } from "react-cropper";
import "../../../style/cropper.css";

interface Props {
  file: File | null;
  open: boolean;
  onClose: () => void;
  onCrop: (file: File) => void;
}

export default function CropperModal({ file, open, onClose, onCrop }: Props) {
  // React 元素 ref
  const reactCropperRef = useRef<ReactCropperElement | null>(null);
  // CropperJS 實例 ref
  const cropperInstanceRef = useRef<CropperJS | null>(null);

  const [ready, setReady] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /** 重新嘗試取得 Canvas，避免 null */
  const tryGetCroppedCanvas = async (
    cropper: CropperJS,
    attempts = 10,
    wait = 120
  ): Promise<HTMLCanvasElement | null> => {
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

      try {
        cropper.clear();
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
    const cropper = cropperInstanceRef.current;
    if (!cropper) return;

    const canvas = await tryGetCroppedCanvas(cropper);
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
            ref={reactCropperRef} // React 元素 ref
            onInitialized={(instance) => {
              cropperInstanceRef.current = instance; // CropperJS 實例 ref
              setReady(true);
            }}
          />
        </div>

        {/* 按鈕 */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            取消
          </button>

          <button
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
