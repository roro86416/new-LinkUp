// event/[id]/page.tsx

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function EventDetailPage({ params }: PageProps) {
  // 等待 params 被 resolve
  const { id: eventId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-6 text-red-500">找不到活動資料</div>;
  }

  const json = await res.json();
  const event = json.data.event; // 根據你的回傳結構

  return (
    <div className="p-6">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      {/* 其他資料... */}
    </div>
  );
}
