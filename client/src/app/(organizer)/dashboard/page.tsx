// client/src/app/(organizer)/dashboard/page.tsx
import Link from "next/link";
import EventActions from "./EventActions";

type EventStatus = "PENDING" | "APPROVED" | "REJECTED";
type EventType = "OFFLINE" | "ONLINE";

type Event = {
  id: number;
  organizer_id: string;
  title: string;
  subtitle: string | null;
  description: string;
  cover_image: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  location_name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: EventStatus;
  event_type: EventType;
  online_event_url: string | null;
  category_id: number;
  created_at: string;
  updated_at: string;
};

async function fetchOrganizerEvents(): Promise<Event[]> {
  const res = await fetch("http://localhost:3001/api/v1/organizer/events", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("主辦方活動列表取得失敗");
  }

  const json = await res.json();
  return json.data as Event[];
}

function formatDateTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);

  const dateString = start.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const startTime = start.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateString} ${startTime} ~ ${endTime}`;
}

function getStatusStyle(status: EventStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export default async function OrganizerDashboardPage() {
  const events = await fetchOrganizerEvents();
  const now = new Date();

  const total = events.length;
  const upcoming = events.filter(
    (ev) => new Date(ev.start_time) > now
  ).length;
  const finished = events.filter(
    (ev) => new Date(ev.end_time) < now
  ).length;
  const pending = events.filter((ev) => ev.status === "PENDING").length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8">

        {/* 頂部區塊 */}
        <header className="rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-6 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                Organizer Console
              </p>
              <h1 className="text-2xl font-semibold md:text-3xl">
                主辦方儀表板
              </h1>
              <p className="max-w-xl text-sm text-slate-300">
                先用「我的活動列表」作為主視覺，後續可以再加上報名數、收入等進階統計。
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-500 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-300 hover:bg-slate-800/60 transition-colors"
              >
                匯出報表（預留）
              </button>

              {/* 🔗 這裡改成導到 /events/new */}
              <Link
                href="/events/new"
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-100 transition-colors inline-flex items-center justify-center"
              >
                ＋ 新增活動
              </Link>
            </div>
          </div>
        </header>

        {/* 上方統計卡片區 */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500">
                  總活動數
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {total}
                </div>
              </div>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 text-sm text-white">
                📋
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-emerald-700">
                  即將開始
                </div>
                <div className="mt-2 text-2xl font-semibold text-emerald-900">
                  {upcoming}
                </div>
              </div>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm text-white">
                ⏰
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500">
                  已結束活動
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {finished}
                </div>
              </div>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm text-white">
                ✅
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-amber-700">
                  待審核（PENDING）
                </div>
                <div className="mt-2 text-2xl font-semibold text-amber-900">
                  {pending}
                </div>
              </div>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-sm text-white">
                📝
              </div>
            </div>
          </div>
        </section>

        {/* 活動列表區 */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                我的活動列表
              </h2>
              <p className="text-xs text-slate-500">
                顯示目前由該主辦管理的所有活動，之後可在此管理報名設定與票券。
              </p>
            </div>

            {/* 這顆也一起導到 /events/new */}
            <Link
              href="/events/new"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              ＋ 新增活動
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/70 px-6 py-10 text-center text-sm text-slate-500">
              目前還沒有任何活動，點選右上角「新增活動」開始建立你的第一場活動吧！
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50/80">
                  <tr className="text-xs text-slate-500">
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">
                      ID
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">
                      活動名稱
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">
                      副標題
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">
                      時間
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">
                      地點
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">
                      狀態
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev, index) => (
                    <tr
                      key={ev.id}
                      className={
                        "align-top text-slate-700 " +
                        (index % 2 === 0 ? "bg-white" : "bg-slate-50/40")
                      }
                    >
                      <td className="border-b border-slate-100 px-4 py-3 text-xs text-slate-500">
                        {ev.id}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {ev.title}
                        </div>
                        {ev.event_type === "ONLINE" && (
                          <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                            線上活動
                          </span>
                        )}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-xs text-slate-600">
                        {ev.subtitle || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-xs text-slate-600">
                        {formatDateTimeRange(ev.start_time, ev.end_time)}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-xs text-slate-600">
                        <div className="font-medium text-slate-800">
                          {ev.location_name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ev.address}
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <span
                          className={
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium " +
                            getStatusStyle(ev.status)
                          }
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <EventActions eventId={ev.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}