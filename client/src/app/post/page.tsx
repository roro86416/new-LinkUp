import FeaturedCard from './post-component/card/FeaturedCard';
import GridCard from './post-component/card/Gridcard';
import HorizontalCard from './post-component/card/HorizontalCard';
import CreatorButton from '../post/post-component/ui/CreatorButton';
import FeaturedCarousel from './post-component/card/FeaturedCarousel';

const FEATURED_ITEMS = [
	{
		image: `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763835804589-798662722.jpg`,
		category: '音樂會',
		title: '走進音樂的世界：Scott Robertson 專訪',
		description: '帶你深入了解音樂創作與舞台背後的故事…',
		href: '/post/music-life',
	},
	{
		image: `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763835366487-693190998.jpg`,
		category: '嘉年華',
		title: '未來嘉年華：2025 年活動科技新趨勢',
		description: '區塊鏈與科技如何翻轉大型活動的運作方式。',
		href: '/post/future-carnival',
	},
	{
		image: `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763835382845-362950624.jpg`,
		category: '聖誕節',
		title: '2025 聖誕舞台設計趨勢',
		description: '打造節慶氛圍的舞台靈感與視覺設計。',
		href: '/post/christmas-design',
	},
];

export default function PostHomePage() {
	return (
		<div className="min-h-screen font-sans relative selection:bg-[#EF9D11] selection:text-white overflow-x-hidden pb-20">
			{/* 1. 背景特效層 (與首頁一致) */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				{/* 漸層底色 */}
				<div className="absolute inset-0 bg-[linear-gradient(180deg,#EEEEEE_0%,#7D8B93_45%,#0C2838_100%)]"></div>
				{/* 紋理疊加 */}
				<div
					className="absolute inset-0 opacity-30 mix-blend-overlay"
					style={{
						backgroundImage: `url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop')`,
						backgroundSize: 'cover',
						filter: 'grayscale(100%) contrast(150%)',
					}}
				></div>
				{/* 星塵噪點 */}
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
			</div>

			{/* 頂部 Header 留白 */}
			<div className="fixed top-0 left-0 w-full h-20 z-50 pointer-events-none"></div>

			{/* 2. 主要內容區 (z-10 確保在背景之上) */}
			<main className="relative z-10 pt-24 px-4 container mx-auto max-w-6xl">
				<div className="space-y-24">
					{/* Hero / Featured Section */}
					<section className="w-full">
						<FeaturedCarousel items={FEATURED_ITEMS} interval={5000} />
					</section>

					{/* Editor Picks Section */}
					<section className="w-full">
						<h2 className="text-3xl font-extrabold mb-8 text-white drop-shadow-md flex items-center gap-2">
							<span className="text-[#EF9D11]">#</span> 編輯精選
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<GridCard
								image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763837038614-382542749.jpg`}
								title="音樂祭如何影響城市文化？"
								category="音樂會"
								href="/post/editor-music"
							/>
							<GridCard
								image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763837049040-305200104.jpg`}
								title="大型舞台活動的幕後故事"
								category="嘉年華"
								href="/post/editor-stage"
							/>
							<GridCard
								image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763836179449-31657640.jpg`}
								title="那些讓活動更美好的創作者們"
								category="愛心活動"
								href="/post/editor-creators"
							/>
						</div>
					</section>

					{/* Trending Section (改為玻璃擬態背景) */}
					<section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 md:p-12 shadow-2xl">
						<div className="w-full">
							<h2 className="text-3xl font-extrabold mb-8 text-white flex items-center gap-2">
								<span className="text-red-500">🔥</span> 熱門趨勢
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<GridCard
									image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763837029903-811921704.jpg`}
									title="戶外活動再次崛起！為什麼？"
									category="嘉年華"
									href="/post/trend-outdoor"
								/>
								<GridCard
									image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763836169707-417338611.jpg`}
									title="讓人敬佩的活動創作者們"
									category="愛心活動"
									href="/post/trend-creators"
								/>
								<GridCard
									image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763837021547-530289897.jpg`}
									title="夜生活文化的下一步"
									category="音樂會"
									href="/post/trend-nightlife"
								/>
							</div>
						</div>
					</section>

					{/* Tips & Guides */}
					<section className="w-full">
						<h2 className="text-3xl font-extrabold mb-8 text-white drop-shadow-md flex items-center gap-2">
							<span className="text-blue-400">📚</span> 實用指南
						</h2>
						<div className="space-y-6">
							<HorizontalCard
								image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763835796792-173259613.jpg`}
								category="咖啡相關活動"
								title="提升活動行銷的 10 個小技巧"
								description="簡單易懂的行銷策略，讓你的活動更容易被看見。"
								href="/post/guide-marketing"
							/>

							<HorizontalCard
								image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763836179449-31657640.jpg`}
								category="愛心活動"
								title="打造願意回流的忠實觀眾群"
								description="讓你的活動成為大家每年必參加的選擇。"
								href="/post/guide-audience"
							/>
						</div>
					</section>

					{/* Community Highlight Section (改為玻璃擬態背景) */}
					<section className="bg-[#EF9D11]/20 backdrop-blur-xl border border-[#EF9D11]/30 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
						{/* 裝飾光暈 */}
						<div className="absolute top-0 right-0 w-64 h-64 bg-[#EF9D11]/30 blur-[100px] rounded-full pointer-events-none"></div>

						<div className="w-full relative z-10">
							<h2 className="text-3xl font-extrabold mb-8 text-white flex items-center gap-2">
								<span className="text-yellow-300">✨</span> 社群亮點
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<FeaturedCard
									image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763836169707-417338611.jpg`}
									title="活動創作者如何讓人們聚在一起"
									category="愛心活動"
									href="/post/community-main"
								/>

								<div className="space-y-3">
									<GridCard
										image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763376404896-842942761.jpg`}
										title="聖誕節的溫馨時刻與傳統"
										category="節慶活動"
										href="/post/detail1/1"
									/>
									<GridCard
										image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763835776791-838774558.jpg`}
										title="活動如何幫助人們建立連結"
										category="咖啡相關活動"
										href="/post/community-connect"
									/>
								</div>
							</div>
						</div>
					</section>

					{/* Tools & Features */}
					<section className="w-full">
						<h2 className="text-3xl font-extrabold mb-8 text-white drop-shadow-md flex items-center gap-2">
							<span className="text-green-400">🛠️</span> 工具與功能
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<GridCard
								image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763088247815-714015603.jpg`}
								title="如何使用活動折扣碼？"
								category="嘉年華"
								href="/post/tools-coupon"
							/>
							<GridCard
								image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763835785522-621470929.jpg`}
								title="自動化工具讓你省下更多時間"
								category="咖啡相關活動"
								href="/post/tools-automation"
							/>
							<GridCard
								image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/file-1763836156058-917696741.jpg`}
								title="活動主辦人必學的最佳做法"
								category="愛心活動"
								href="/post/tools-bestpractices"
							/>
						</div>
					</section>

					<CreatorButton href="../post/backend/admin/create-post" />
				</div>
			</main>
		</div>
	);
}
