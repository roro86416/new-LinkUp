// new-LinkUp/client/src/components/EventTabs.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from 'next/navigation'; // [新增] 抓取 URL 參數
import {
  Paper,
  Tabs,
  Title,
  Text,
  Group,
  Loader,
  Avatar,
  Rating,
  Divider,
  Button,
  Textarea,
} from "@mantine/core";
import { useUser } from "../../../../context/auth/UserContext";
import { apiClient } from "../../../../api/auth/apiClient"; // [新增] 使用統一的 API Client
import toast from "react-hot-toast";

interface EventTabsProps {
  eventId: number;
  description: string;
}

/* 天氣資料型別 */
type Weather = {
  stationName?: string;
  obsTime?: string;
  temperature?: string | number | null;
  humidity?: string | number | null;
  windSpeed?: string | number | null;
  windDirection?: string | null;
};

/* 評論資料型別 */
interface Review {
  id: number;
  rating: number; // 對應後端的 rating 或 score
  comment: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export default function EventTabs({ eventId, description }: EventTabsProps) {
  const { user } = useUser();
  const searchParams = useSearchParams();
  
  // [修復 1] Tab 控制邏輯：監聽 URL 參數
  // 如果 URL 有 action=review 或 tab=comments，預設開啟評論區
  const initialTab = (searchParams.get('action') === 'review' || searchParams.get('tab') === 'comments') 
    ? 'comments' 
    : 'intro';
  
  const [activeTab, setActiveTab] = useState<string | null>(initialTab);

  // 監聽 URL 變化，動態切換 Tab (例如從訂單頁跳轉過來時)
  useEffect(() => {
    const action = searchParams.get('action');
    const tab = searchParams.get('tab');
    if (action === 'review' || tab === 'comments') {
      setActiveTab('comments');
    }
  }, [searchParams]);

  /* 天氣狀態 */
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  /* 評論狀態 */
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  /* 撰寫/編輯狀態 */
  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  /* ---------------- WEATHER API ---------------- */
  useEffect(() => {
    if (!eventId) return;
    const fetchWeather = async () => {
      try {
        setLoadingWeather(true);
        const res = await apiClient.get<any>(`/api/events/${eventId}/weather`);
        if (res.success) {
          setWeather(res.data.weather);
        }
      } catch (err) {
        console.error("天氣載入失敗", err);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [eventId]);

  /* ---------------- REVIEWS GET API ---------------- */
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      // 使用 apiClient 自動處理 Base URL
      const res = await apiClient.get<any>(`/api/ratings/${eventId}`);
      if (res.success) {
        setReviews(res.data);
        setAvgRating(res.averageRating ?? null);
      }
    } catch (err) {
      console.error("評論載入失敗", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchReviews();
  }, [eventId]);

  /* ---------------- 計算邏輯 ---------------- */
  // 找出「我的評論」
  const myReview = useMemo(() => {
    if (!user) return null;
    return reviews.find(r => r.user.id === user.userId);
  }, [reviews, user]);

  // 找出「其他人的評論」
  const otherReviews = useMemo(() => {
    if (!user) return reviews;
    return reviews.filter(r => r.user.id !== user.userId);
  }, [reviews, user]);

  // 判斷是否顯示「撰寫區塊」：
  // 1. 尚未評論 (myReview不存在)
  // 2. 且網址帶有 ?action=review (表示從訂單頁跳轉過來，意圖明確)
  const showWriteBox = !myReview && searchParams.get('action') === 'review';

  /* ---------------- API ACTION ---------------- */

  // 新增評論
  const handlePostReview = async () => {
    if (!myRating || !myComment.trim()) return;
    if (!user) { toast.error("請先登入"); return; }

    try {
      setIsSubmitting(true);
      
      // [修復 2] Zod Error 關鍵修正：強制將 eventId 轉為數字
      // apiClient 會自動帶入 Authorization Header
      await apiClient.post('/api/ratings', {
        eventId: Number(eventId), 
        userId: user.userId,
        score: myRating,
        comment: myComment,
      });

      toast.success("評論發表成功！");
      await fetchReviews(); // 重新整理列表
      setMyRating(0);
      setMyComment("");
      
      // 如果是從訂單頁跳轉來的，成功後可以考慮把 URL 參數清掉，避免刷新又跳回來 (選做)
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "發表失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 更新評論
  const handleUpdateReview = async (ratingId: number) => {
    try {
      setIsSubmitting(true);
      await apiClient.patch(`/api/ratings/${ratingId}`, {
        rating: myRating,
        comment: myComment,
      });
      toast.success("修改成功");
      await fetchReviews();
      setEditingId(null);
    } catch (err) {
      toast.error("修改失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 刪除評論
  const handleDeleteReview = async (ratingId: number) => {
    if (!window.confirm("確定要刪除這則評論嗎？")) return;
    try {
      await apiClient.delete(`/api/ratings/${ratingId}`);
      toast.success("已刪除評論");
      // 前端直接過濾掉，省去一次 API 呼叫
      setReviews(prev => prev.filter(r => r.id !== ratingId));
      setEditingId(null);
      setMyRating(0);
      setMyComment("");
    } catch (err) {
      toast.error("刪除失敗");
    }
  };

  // 進入編輯模式
  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setMyRating(review.rating);
    setMyComment(review.comment);
  };

  return (
    // 使用受控模式 (value + onChange) 讓 URL 參數能控制 Tab
    <Tabs value={activeTab} onChange={setActiveTab} mt="xl">
      <Tabs.List>
        <Tabs.Tab value="intro">活動簡介</Tabs.Tab>
        <Tabs.Tab value="weather">活動天氣</Tabs.Tab>
        <Tabs.Tab value="comments">活動評價 ({reviews.length})</Tabs.Tab>
      </Tabs.List>

      {/* 活動簡介 */}
      <Tabs.Panel value="intro" pt="md">
        <Paper p={24} withBorder radius="md">
          <Title order={4}>活動簡介</Title>
          <Text mt="sm">{description}</Text>
        </Paper>
      </Tabs.Panel>

      {/* 活動天氣 */}
      <Tabs.Panel value="weather" pt="md">
        <Paper p={24} withBorder radius="md">
          <Title order={4}>活動天氣</Title>
          {loadingWeather && <Loader mt="md" />}
          {weather && (
            <div style={{ marginTop: "1rem" }}>
              <Text>氣象站：{weather.stationName}</Text>
              <Text>觀測時間：{weather.obsTime}</Text>
              <Text>氣溫：{weather.temperature} °C</Text>
              <Text>濕度：{weather.humidity} %</Text>
              <Text>風速：{weather.windSpeed} m/s</Text>
            </div>
          )}
        </Paper>
      </Tabs.Panel>

      {/* 評論區 */}
      <Tabs.Panel value="comments" pt="md">
        <Paper p={24} withBorder radius="md">
          <Group justify="space-between" align="center" mb="lg">
             <Title order={4}>活動評價</Title>
             {avgRating !== null && (
                <Group gap="xs">
                    <Text size="sm" fw={700} c="orange">{Number(avgRating).toFixed(1)} 分</Text>
                    <Rating value={avgRating} fractions={2} readOnly size="sm" />
                </Group>
             )}
          </Group>

          {/* ==================== 頂部區塊：根據狀態顯示不同內容 ==================== */}
          <div style={{ marginBottom: '2rem' }}>
            
            {/* 情境 A: 已經有評論 -> 顯示自己的評論 (檢視/編輯) */}
            {myReview ? (
                <Paper shadow="sm" p="lg" radius="md" withBorder bg="blue.0">
                    <Group justify="space-between" mb="xs">
                        <Group>
                           <Avatar src={myReview.user.avatar} radius="xl" />
                           <div>
                               <Text fw={700} size="sm">我的評價</Text>
                               <Text size="xs" c="dimmed">{new Date(myReview.created_at).toLocaleString("zh-TW")}</Text>
                           </div>
                        </Group>
                        {editingId !== myReview.id && (
                            <Group gap="xs">
                                <Button variant="subtle" size="xs" onClick={() => startEdit(myReview)}>編輯</Button>
                                <Button variant="subtle" color="red" size="xs" onClick={() => handleDeleteReview(myReview.id)}>刪除</Button>
                            </Group>
                        )}
                    </Group>

                    {/* 編輯模式 */}
                    {editingId === myReview.id ? (
                        <div style={{ marginTop: '1rem' }}>
                            <Rating value={myRating} onChange={setMyRating} mb="sm" size="lg" />
                            <Textarea 
                                value={myComment} 
                                onChange={(e) => setMyComment(e.target.value)} 
                                minRows={3} 
                                placeholder="修改你的評論..."
                            />
                            <Group mt="sm" justify="flex-end">
                                <Button variant="default" size="xs" onClick={() => setEditingId(null)}>取消</Button>
                                <Button color="blue" size="xs" loading={isSubmitting} onClick={() => handleUpdateReview(myReview.id)}>更新評價</Button>
                            </Group>
                        </div>
                    ) : (
                        /* 檢視模式 */
                        <>
                            <Rating value={myReview.rating} readOnly size="sm" mb={4} />
                            <Text>{myReview.comment}</Text>
                        </>
                    )}
                </Paper>

            /* 情境 B: 還沒評論 + 從訂單頁跳轉來 -> 顯示撰寫表單 */
            ) : showWriteBox ? (
                <Paper p="lg" radius="md" withBorder style={{ borderColor: '#EF9D11', borderWidth: 2 }}>
                    <Title order={5} mb="md">快來留下你的評價吧！</Title>
                    <Rating value={myRating} onChange={setMyRating} size="lg" mb="sm" />
                    <Textarea
                        placeholder="分享你的活動體驗..."
                        value={myComment}
                        onChange={(e) => setMyComment(e.target.value)}
                        minRows={3}
                        mb="md"
                    />
                    <Button 
                        color="orange" 
                        fullWidth 
                        disabled={!myRating || !myComment.trim()} 
                        loading={isSubmitting}
                        onClick={handlePostReview}
                    >
                        送出評價
                    </Button>
                </Paper>

            /* 情境 C: 還沒評論 + 路人模式 -> 顯示提示 */
            ) : (
                <Paper p="md" bg="gray.0" radius="md">
                    <Text align="center" c="dimmed" size="sm">
                        參加活動後可於「我的訂單」中留下評價。
                    </Text>
                </Paper>
            )}
          </div>

          <Divider label="看看參加過的人怎麼說" labelPosition="center" mb="lg" />

          {/* ==================== 底部區塊：其他人的評論 ==================== */}
          {loadingReviews && <Loader mx="auto" />}
          
          {!loadingReviews && otherReviews.length === 0 && (
              <Text align="center" c="dimmed" py="xl">目前還沒有其他人留言。</Text>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {otherReviews.map((r) => (
              <Paper key={r.id} shadow="xs" p="md" radius="md" withBorder>
                <Group align="flex-start">
                  <Avatar src={r.user.avatar ?? null} radius="xl" />
                  <div>
                    <Group gap="xs" align="center">
                        <Text fw={600} size="sm">{r.user.name}</Text>
                        <Rating value={r.rating} readOnly size="xs" />
                    </Group>
                    <Text size="xs" c="dimmed" mb="xs">
                      {new Date(r.created_at).toLocaleString("zh-TW")}
                    </Text>
                    <Text size="sm">{r.comment}</Text>
                  </div>
                </Group>
              </Paper>
            ))}
          </div>

        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}