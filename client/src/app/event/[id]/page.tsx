import Image from 'next/image';
import {
  ClockIcon,
  MapPinIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import {
  browseEvents,
  newlyAddedEvents,
  popularEvents,
  DetailedEvent,
} from '../data';
import EventContentTabs from './EventContentTabs'; // 導入新的客戶端元件

// 合併所有活動資料
const allDetailedEvents: DetailedEvent[] = [
  ...popularEvents,
  ...newlyAddedEvents,
  ...browseEvents,
];

// 根據 ID 取得活動
function getEventById(id: number): DetailedEvent | undefined {
  return allDetailedEvents.find((event) => event.id === id);
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params; // 使用 await 解析 Promise
  const eventId = Number(id);
  if (!id || isNaN(eventId)) { // 修正：使用解構後的 id 進行檢查
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-700">無效的活動 ID</h1>
      </div>
    );
  }

  const event = getEventById(eventId);

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-700">找不到活動</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={event.img}
            alt={event.title}
            fill  // ❗ 用 fill 取代舊的 layout="fill"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {event.title}
          </h1>

          <p className="text-lg text-gray-600 mb-4">{event.date}</p>

          {/* 新增的詳細資訊區塊 */}
          <div className="space-y-4 text-gray-700 mb-6">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <LinkIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />
              <a href={event.relatedLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline truncate">
                {event.relatedLink}
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <EventContentTabs event={event} />
        </div>
      </div>
    </div>
  );
}
