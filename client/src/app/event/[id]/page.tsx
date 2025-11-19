// client/src/app/event/[id]/page.tsx

import EventDetailPageClient from "./pageClient";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ★★★ 解決你的核心問題：params 是 Promise，要 await
  const { id } = await params;

  return <EventDetailPageClient eventId={Number(id)} />;
}