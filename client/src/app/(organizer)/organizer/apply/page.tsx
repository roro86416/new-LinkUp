"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ✅ 建議用 env
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function ApplyOrganizerPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    const token = localStorage.getItem("linkup_token");
    if (!token) {
      setStatus("error");
      setMessage("請先登入會員帳號，再升級為主辦方。");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/organizer/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ 先嘗試 parse json
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || json.error || "申請主辦方失敗");
      }

      // ✅ 重點：存新 token（後端要回傳 token）
      if (json.token) {
        localStorage.setItem("linkup_token", json.token);
      }

      setStatus("success");
      setMessage("已成功升級為主辦方，為你導向儀表板…");

      // ✅ 可直接 push（Header 的 role 會因新 token 變 ORGANIZER）
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh(); // 讓 layout / header 重抓狀態
      }, 800);

    } catch (err: Error | unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "申請主辦方失敗");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Organizer
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            升級為主辦方
          </h1>
          <p className="text-sm text-slate-600">
            使用同一組會員帳號即可管理活動，建立票券、查看報名狀況等。升級後仍然可以用相同帳號購票、參加活動。
          </p>
        </header>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-slate-900">升級說明</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>升級免費，隨時可以開始建立活動。</li>
            <li>同一個帳號同時是「一般使用者」與「主辦方」。</li>
            <li>之後可以從「主辦方儀表板」管理所有活動。</li>
          </ul>

          <button
            onClick={handleApply}
            disabled={status === "loading"}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {status === "loading" ? "送出申請中…" : "一鍵升級為主辦方"}
          </button>

          {message && (
            <p
              className={`mt-2 text-sm ${
                status === "error" ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {message}
            </p>
          )}
        </section>

        <div className="text-xs text-slate-500">
          已經是主辦方了嗎？{" "}
          <Link href="/dashboard" className="text-slate-900 underline">
            前往主辦方儀表板
          </Link>
        </div>
      </div>
    </main>
  );
}