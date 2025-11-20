// new-LinkUp/client/src/app/event/[id]/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, Clock, MapPin, Ticket, Building2, ChevronRight, 
  Share2, Heart, Info, DollarSign, Sparkles, CloudSun, Map as MapIcon, Star, Home, UserPlus, CloudRain, Thermometer, Wind, Droplets, ChevronDown, ChevronUp 
} from 'lucide-react';

// API & Contexts
import { getEventDetail, getEvents, getEventWeather, EventDetailData, WeatherData } from '../../../api/event-api';
import { EventCardData } from '../../../components/card/EventCard';
import HomeEventCard from '../../../components/card/HomeEventCard';
import { useUser } from '../../../context/auth/UserContext';
import { useModal } from '../../../context/auth/ModalContext';



const Breadcrumb = ({ title }: { title: string }) => (
  <nav className="inline-flex items-center gap-2 text-sm text-gray-200 mb-6 animate-in fade-in slide-in-from-left-2 duration-500 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
    <Link href="/" className="hover:text-[#EF9D11] transition-colors flex items-center gap-1">
      <Home size={14} /> 首頁
    </Link>
    <ChevronRight size={14} className="text-gray-400" />
    <Link href="/events" className="hover:text-[#EF9D11] transition-colors">
      活動列表
    </Link>
    <ChevronRight size={14} className="text-gray-400" />
    <span className="text-white font-medium truncate max-w-[150px] md:max-w-xs" title={title}>
      {title}
    </span>
  </nav>
);

const EventMap = ({ address }: { address: string }) => {
  const encodedAddress = encodeURIComponent(address);
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/20 shadow-inner bg-gray-800 relative">
        <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}></iframe>
    </div>
  );
};

const EventWeather = ({ weatherData, location }: { weatherData: WeatherData | null, location: string }) => {
  if (!weatherData) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
            <CloudSun size={48} className="mx-auto mb-2 opacity-50" />
            <p>目前無法取得 {location} 的氣象資訊，請確認後端連線。</p>
        </div>
    );
  }

  const isForecast = weatherData.isForecast;
  const rainLabel = isForecast ? "降雨機率" : "降雨量";
  const rainUnit = isForecast ? "%" : " mm";
  const timeLabel = isForecast ? "預報時間" : "觀測時間";
  const badgeColor = isForecast ? "bg-blue-500/80" : "bg-green-500/80";
  const badgeText = isForecast ? "活動預報" : "目前即時";

  return (
    <div className="bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-white/20 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="text-center md:text-left min-w-[160px]">
                <h4 className="font-bold text-xl mb-1 flex items-center justify-center md:justify-start gap-2">
                    {weatherData.stationName}
                    <span className={`text-xs font-normal ${badgeColor} px-2 py-0.5 rounded text-white`}>
                        {badgeText}
                    </span>
                </h4>
                <div className="flex items-center justify-center md:justify-start gap-3 my-2">
                    {weatherData.weatherDesc.includes('雨') ? (
                         <CloudRain size={56} className="text-blue-300 animate-bounce-slow" />
                    ) : (
                         <CloudSun size={56} className="text-yellow-400 animate-pulse" />
                    )}
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                        {weatherData.temperature}°C
                    </div>
                </div>
                <p className="text-sm text-gray-300 font-medium">
                    {weatherData.weatherDesc}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {timeLabel}：{new Date(weatherData.obsTime).toLocaleString('zh-TW', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                </p>
            </div>

            <div className="w-full h-px md:w-px md:h-24 bg-white/10 my-2 md:my-0"></div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm flex-1 w-full md:w-auto">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><CloudRain size={20} className="text-blue-400"/></div>
                    <div>
                        <span className="block text-gray-400 text-xs">{rainLabel}</span>
                        <span className="font-bold text-lg">{weatherData.rainfall}{rainUnit}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Thermometer size={20} className="text-red-300"/></div>
                    <div>
                        <span className="block text-gray-400 text-xs">體感舒適度</span>
                        <span className="font-bold text-lg">
                             {weatherData.temperature > 28 ? '悶熱' : weatherData.temperature < 20 ? '涼爽' : '舒適'}
                        </span>
                    </div>
                </div>
                {!isForecast && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg"><Droplets size={20} className="text-blue-300"/></div>
                        <div>
                            <span className="block text-gray-400 text-xs">相對濕度</span>
                            <span className="font-bold text-lg">{weatherData.humidity}%</span>
                        </div>
                    </div>
                )}
                {!isForecast && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg"><Wind size={20} className="text-gray-300"/></div>
                        <div>
                            <span className="block text-gray-400 text-xs">風速</span>
                            <span className="font-bold text-lg">{weatherData.windSpeed} m/s</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-blue-200/70 flex gap-2 items-start">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <p>
                {isForecast 
                    ? "此為氣象局發布之活動時段天氣預報，實際天氣仍可能隨時變化。" 
                    : "因活動日期距離過遠（超過 7 天），目前僅顯示活動地點之「即時」天氣觀測供參考，請於活動前 7 天再來查看準確預報。"
                }
            </p>
        </div>
    </div>
  );
};

const ReviewList = ({ reviews, average, count }: { reviews: any[], average?: number, count?: number }) => (
    <div className="space-y-8">
        <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-center">
                <div className="text-5xl font-bold text-white">{average || 0}</div>
                <div className="flex text-[#EF9D11] text-sm justify-center my-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.round(average || 0) ? "currentColor" : "none"} />
                    ))}
                </div>
                <div className="text-xs text-gray-400">{count || 0} 則評論</div>
            </div>
            <div className="h-12 w-px bg-white/10"></div>
            <div className="flex-1">
                <p className="text-gray-300 text-sm">看看參加過的人怎麼說...</p>
                <button className="mt-2 text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full transition-colors">
                    撰寫評論
                </button>
            </div>
        </div>
        <div className="space-y-6">
            {reviews && reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="border-b border-white/10 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                {review.user_name[0]}
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">{review.user_name}</div>
                                <div className="text-xs text-gray-500">{review.created_at}</div>
                            </div>
                        </div>
                        <div className="flex text-[#EF9D11]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed pl-13">
                        {review.comment}
                    </p>
                </div>
            )) : (
                <p className="text-center text-gray-500 py-4">目前還沒有評論，搶先頭香！</p>
            )}
        </div>
    </div>
);

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id; 
  const router = useRouter();
  const { user } = useUser();
  const { openLogin } = useModal();

  const [event, setEvent] = useState<EventDetailData | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventCardData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'info' | 'ticket' | 'organizer' | 'map' | 'weather' | 'rating'>('info');
  const [favorited, setFavorited] = useState(false);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventId = Number(id);
        const eventData = await getEventDetail(eventId);
        setEvent(eventData);
        const allEvents = await getEvents('all', 10);
        setRelatedEvents(allEvents.filter(e => e.id !== eventId).slice(0, 3));
        const weather = await getEventWeather(eventId);
        setWeatherData(weather);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRegister = () => {
    if (!user) { openLogin(); return; }
    router.push(`/checkout/select-ticket?eventId=${id}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('連結已複製！');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
    });
  };

  const getCategoryName = (cat: any) => {
      if (!cat) return '精選活動';
      if (typeof cat === 'string') return cat;
      return cat.name || '精選活動';
  };

  const toggleDescription = () => {
    if (isDescriptionExpanded) {
        tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0C2838] text-white"><Sparkles className="animate-spin w-8 h-8 text-[#EF9D11]" /></div>;
  }
  if (!event) return null;

  return (
    <div className="min-h-screen font-sans relative selection:bg-[#EF9D11] selection:text-white pb-20 w-full">
      
      {/* 背景層 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#EEEEEE_0%,#7D8B93_45%,#0C2838_100%)]"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop')`, backgroundSize: 'cover', filter: 'grayscale(100%) contrast(150%)' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[700px] md:h-[740px] overflow-hidden">
        <div 
            className="absolute inset-0"
            style={{
                maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
            }}
        >
            <Image src={event.cover_image} alt={event.title} fill className="object-cover object-top blur-sm scale-105 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C2838] via-[#0C2838]/50 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12 md:pb-20">
           <div className="absolute top-24 md:top-32 left-4 md:left-4">
              <Breadcrumb title={event.title} />
           </div>

           <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="hidden md:block w-64 h-84 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 flex-shrink-0 transform translate-y-12">
                  <Image src={event.cover_image} alt={event.title} width={256} height={336} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 text-white mb-4 md:mb-0">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="bg-[#EF9D11] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-orange-500/30">
                        {getCategoryName(event.category)}
                     </span>
                     <span className="bg-white/10 backdrop-blur-md text-gray-100 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                        {event.organizer.name}
                     </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {event.title}
                  </h1>
                  {event.subtitle && <h2 className="text-xl text-gray-200 mb-4 font-medium drop-shadow-md">{event.subtitle}</h2>}
                  
                  <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-100 mt-6 font-medium drop-shadow-md">
                      <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                          <Calendar size={18} className="text-[#EF9D11]" /> {formatDate(event.start_time)}
                      </div>
                      <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                          <MapPin size={18} className="text-[#EF9D11]" /> {event.location_name}
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* 主要內容區 */}
      <div className="relative z-20 container mx-auto px-4 -mt-4 md:-mt-2">
         <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* 左側 */}
            <div className="flex-1 min-w-0 w-full">
                {/* 修正：增加 flex flex-col h-full min-h-[500px] 讓按鈕可以被推到底部 */}
                <div ref={tabsRef} className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col min-h-[500px]">
                    <div className="flex gap-3 border-b border-white/10 pb-4 mb-6 overflow-x-auto scrollbar-hide flex-shrink-0">
                        {[
                            { id: 'info', label: '活動詳情', icon: Info },
                            { id: 'ticket', label: '票種資訊', icon: Ticket },
                            { id: 'map', label: '活動地圖', icon: MapIcon },
                            { id: 'weather', label: '活動天氣', icon: CloudSun },
                            { id: 'rating', label: '活動評價', icon: Star },
                            { id: 'organizer', label: '主辦單位', icon: Building2 },
                        ].map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap font-bold text-sm ${activeTab === tab.id ? 'bg-[#EF9D11] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 內容區域設為 flex-1，讓它佔據剩餘空間 */}
                    <div className="text-gray-200 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
                        
                        {activeTab === 'info' && (
                            <div className="flex flex-col flex-1 relative">
                                {/* 文章內容 */}
                                <div 
                                    className={`prose prose-invert max-w-none prose-p:text-gray-300 overflow-hidden transition-all duration-500 ${
                                        isDescriptionExpanded ? 'max-h-none pb-8' : 'max-h-[500px]'
                                    }`}
                                    // 修改重點：移除原本的遮罩 div，改用 maskImage 直接讓文字變透明
                                    style={{
                                        maskImage: isDescriptionExpanded 
                                            ? 'none' 
                                            : 'linear-gradient(to bottom, black 60%, transparent 100%)',
                                        WebkitMaskImage: isDescriptionExpanded 
                                            ? 'none' 
                                            : 'linear-gradient(to bottom, black 60%, transparent 100%)'
                                    }}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                                </div>

                                {/* 已移除原本那個 bg-gradient-to-t 的 div 
                                   現在不需要它了，畫面會更乾淨 
                                */}
                                
                                {/* 按鈕容器：保持在最底部 */}
                                <div className="mt-auto pt-8 flex justify-center w-full relative z-10">
                                    <button 
                                        onClick={toggleDescription}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-all border border-white/10 backdrop-blur-md group"
                                    >
                                        {isDescriptionExpanded ? (
                                            <>收合內容 <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform"/></>
                                        ) : (
                                            <>查看完整介紹 <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform"/></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 其他 Tab 內容保持原樣 */}
                        {activeTab === 'ticket' && <div className="space-y-4">{event.ticketTypes?.map((t: any) => (<div key={t.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex justify-between items-center"><div className="text-white font-bold">{t.name}<p className="text-sm text-gray-400 font-normal">{t.description}</p></div><div className="text-[#EF9D11] font-bold text-2xl">NT$ {t.price}</div></div>))}</div>}
                        {activeTab === 'map' && <div className="space-y-4"><h3 className="font-bold text-white flex gap-2"><MapPin className="text-[#EF9D11]"/> 活動地點</h3><p className="text-gray-300">{event.address}</p><EventMap address={event.address} /></div>}
                        {activeTab === 'weather' && <EventWeather weatherData={weatherData} location={event.location_name.slice(0,3)} />}
                        {activeTab === 'rating' && <ReviewList reviews={event.reviews || []} average={event.rating_average} count={event.rating_count} />}
                        
                        {activeTab === 'organizer' && (
                            <div className="flex flex-col gap-8 pt-4">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/10 flex-shrink-0">
                                        {event.organizer.avatar ? <Image src={event.organizer.avatar} alt="" width={128} height={128}/> : <span className="text-4xl font-bold text-white/50">{event.organizer.name[0]}</span>}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-bold text-white mb-2">{event.organizer.name}</h3>
                                        <p className="text-gray-400 mb-4 max-w-lg">致力於舉辦最優質的活動體驗，歡迎追蹤我們的主辦專頁以獲得最新活動資訊。</p>
                                        <div className="flex gap-3 justify-center md:justify-start">
                                            <button className="flex items-center gap-2 text-sm bg-[#EF9D11] hover:bg-[#d88d0e] text-white px-6 py-2 rounded-full transition-all font-bold shadow-lg">
                                                <UserPlus size={16} />
                                                追蹤主辦
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-white/10 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-white">該主辦的其他活動</h4>
                                        <Link 
                                            href={`/events?organizerId=${event.organizer.id || ''}`} 
                                            className="text-sm text-[#EF9D11] hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                            查看更多 <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {relatedEvents.slice(0,2).map(e => (
                                            <div key={e.id} className="flex gap-3 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                                <div className="w-16 h-16 rounded bg-gray-800 flex-shrink-0 overflow-hidden"><Image src={e.cover_image} alt="" width={64} height={64} className="w-full h-full object-cover"/></div>
                                                <div>
                                                    <div className="text-sm font-bold text-white line-clamp-1">{e.title}</div>
                                                    <div className="text-xs text-gray-400 mt-1">{e.start_time.split('T')[0]}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 右側：Sticky Sidebar */}
            <div className="lg:w-80 flex-shrink-0 mt-8 lg:mt-0 sticky top-24 h-fit self-start">
                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl ring-1 ring-white/10">
                    <h3 className="text-xl font-bold text-white mb-5 pb-3 border-b border-white/10">活動資訊</h3>
                    <div className="space-y-5 text-sm text-gray-300">
                        <div className="flex items-start gap-3"><div className="p-2 rounded-lg bg-white/5"><MapPin size={18} className="text-[#EF9D11]" /></div><div><span className="block font-bold text-white">地點</span><span>{event.location_name}</span></div></div>
                        <div className="flex items-start gap-3"><div className="p-2 rounded-lg bg-white/5"><Clock size={18} className="text-[#EF9D11]" /></div><div><span className="block font-bold text-white">時間</span><span>{formatDate(event.start_time)}</span></div></div>
                        <div className="flex items-start gap-3"><div className="p-2 rounded-lg bg-white/5"><DollarSign size={18} className="text-[#EF9D11]" /></div><div><span className="block font-bold text-white">票價</span><span>詳見票種資訊</span></div></div>
                    </div>
                    <div className="mt-8 space-y-3">
                        <button onClick={handleRegister} className="w-full bg-gradient-to-r from-[#EF9D11] to-[#d88d0e] hover:from-[#FFAF2E] hover:to-[#EF9D11] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"><Ticket size={20} /> 立即購票</button>
                        <div className="flex gap-2">
                            <button onClick={() => setFavorited(!favorited)} className={`flex-1 py-2.5 rounded-xl border font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${favorited ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}`}><Heart size={16} fill={favorited ? 'currentColor' : 'none'} /> 收藏</button>
                            <button onClick={handleShare} className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 font-medium text-sm transition-all flex items-center justify-center gap-1.5"><Share2 size={16} /> 分享</button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0C2838]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mt-4">
                    <p className="text-xs text-gray-400 leading-relaxed flex gap-2">
                        <Info size={16} className="inline flex-shrink-0 mt-0.5" />
                        <span>本活動票券一經售出，退換票請洽主辦單位。請於活動開始前 30 分鐘入場。</span>
                    </p>
                </div>
            </div>
         </div>

         {/* 2. 修正：「猜你也會喜歡」區塊外框樣式 */}
         <div className="mt-16 md:mt-24 pt-12 border-t border-white/10">
            {/* 加上您要的玻璃外框：bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2 drop-shadow-md">
                    <Sparkles className="text-[#EF9D11]" /> 猜你也會喜歡
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedEvents.map(evt => (
                        <div key={evt.id} className="h-full transform hover:-translate-y-1 transition-transform duration-300 border border-white/10 bg-white/5 rounded-xl overflow-hidden shadow-lg">
                            <HomeEventCard event={evt} isFavorited={false} onToggleFavorite={() => {}} />
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}