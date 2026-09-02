// prisma/seed.ts
import { PrismaClient, Role, Prisma } from '../src/generated/prisma/client.js';
import bcrypt from 'bcrypt';
import { eventsByCategory } from './mock-events.js';

// 13 個分類名稱
const categories = [
	'課程',
	'展覽',
	'派對',
	'聚會',
	'市集',
	'比賽',
	'表演',
	'研討會',
	'分享會',
	'見面會',
	'宣傳活動',
	'導覽',
	'體驗',
].map(name => ({ name }));

// ----------------------------------------------------------------------
// 定義 12 個擬真主辦單位資料
// ----------------------------------------------------------------------
const organizerList = [
	{
		name: '台灣數位技能策進會',
		email: 'tech_edu@linkup.test',
		org_desc: '致力於培育台灣數位人才，推動軟體開發與科技應用教育。',
	},
	{
		name: '福爾摩沙咖啡研究室',
		email: 'coffee_lab@linkup.test',
		org_desc: '專注於精品咖啡文化的推廣，從產地到杯中，探索風味的無限可能。',
	},
	{
		name: '國際藝術策展中心',
		email: 'art_center@linkup.test',
		org_desc: '連結在地與國際藝術視野，策劃具備前瞻性與深度的當代藝術展覽。',
	},
	{
		name: 'ShowHouse 娛樂集團',
		email: 'showhouse@linkup.test',
		org_desc: '打造頂級娛樂體驗，舉辦大型演唱會、派對與音樂祭的指標性團隊。',
	},
	{
		name: 'GDG Taipei',
		email: 'gdg_taipei@linkup.test',
		org_desc:
			'Google Developer Group Taipei，為開發者提供技術交流與學習的社群平台。',
	},
	{
		name: '好朋友市集策展團隊',
		email: 'market_friends@linkup.test',
		org_desc: '挖掘在地職人與原創設計，打造最具溫度的週末生活市集。',
	},
	{
		name: '台灣街舞推廣協會',
		email: 'street_dance@linkup.test',
		org_desc:
			'推動街舞文化在地深耕，舉辦各類賽事與教學活動，讓世界看見台灣舞力。',
	},
	{
		name: '子皿有限公司',
		email: 'indie_music@linkup.test',
		org_desc:
			'獨立音樂廠牌，致力於發掘新銳樂團，策劃具備實驗性與感染力的現場演出。',
	},
	{
		name: '台灣綠能產業協會',
		email: 'green_energy@linkup.test',
		org_desc: '串聯產官學界資源，推動再生能源發展與永續經營的專業組織。',
	},
	{
		name: '旅行癮者俱樂部',
		email: 'travel_addict@linkup.test',
		org_desc: '集合背包客與深度旅行者，分享世界各地的故事與冒險經歷。',
	},
	{
		name: '文具文創小舖',
		email: 'stationery@linkup.test',
		org_desc: '熱愛紙筆與插畫的文具控天堂，定期舉辦創作者見面會與手作課程。',
	},
	{
		name: '島內散步',
		email: 'island_walk@linkup.test',
		org_desc: '透過深度導覽與體驗，帶領大眾重新認識台灣這塊土地的歷史與文化。',
	},
];

const prisma = new PrismaClient();

// ----------------------------------------------------------------------
// 建立管理員帳號
// ----------------------------------------------------------------------
async function seedAdmin() {
	console.log('🌱 正在開始管理員 Seeding...');
	const adminEmail = 'admin@example.com';
	const adminPassword = 'password123';

	const existingAdmin = await prisma.admin.findUnique({
		where: { email: adminEmail },
	});

	if (!existingAdmin) {
		const hashedPassword = await bcrypt.hash(adminPassword, 10);
		await prisma.admin.create({
			data: {
				email: adminEmail,
				password_hash: hashedPassword,
				name: 'Admin',
			},
		});
		console.log(`✅ 成功建立管理員帳號: ${adminEmail}`);
	} else {
		console.log('ℹ️ 管理員帳號已存在，跳過建立。');
	}
}

async function main() {
	console.log('🌱 正在開始 Seeding 流程...');

	// 1️⃣ 插入活動類別
	console.log('📂 建立活動分類...');
	const result = await prisma.category.createMany({
		data: categories,
		skipDuplicates: true,
	});
	console.log(`✅ 成功插入/跳過 ${result.count} 個活動類別。`);

	// 呼叫建立管理員的函式
	await seedAdmin();

	// 2️⃣ 建立 12 個測試用 Organizer (包含 User)
	console.log('🏢 建立 12 個測試用 Organizer...');

	const createdOrganizers = [];
	const commonPasswordHash = await bcrypt.hash('password123', 10); // 統一密碼

	for (const orgData of organizerList) {
		// 2.1 建立 User
		const user = await prisma.user.upsert({
			where: { email: orgData.email },
			update: { name: orgData.name },
			create: {
				email: orgData.email,
				password_hash: commonPasswordHash,
				name: orgData.name,
				role: Role.ORGANIZER,
				is_active: true,
			},
		});

		// 2.2 建立 Organizer Profile
		// [修正] 將 description 改為 org_description 以符合 Schema
		const organizer = await prisma.organizer.upsert({
			where: { user_id: user.id },
			update: {
				org_name: orgData.name,
				org_description: orgData.org_desc, // 更新時也同步更新描述
			},
			create: {
				user_id: user.id,
				org_name: orgData.name,
				org_description: orgData.org_desc, // [修正點]
				is_verified: true,
			},
		});

		createdOrganizers.push(organizer);
	}

	console.log(`✅ 成功建立 ${createdOrganizers.length} 個 Organizer 組織。`);

	// -----------------------------------------------
	// 4️⃣ 清除舊資料 (針對這 12 個測試組織)
	// -----------------------------------------------

	console.log('🧹 正在清除舊的假資料 (Events, Tickets, Products, Images)...');

	const organizerIds = createdOrganizers.map(o => o.id);

	// (A) 刪除「票種」(TicketType)
	await prisma.ticketType.deleteMany({
		where: { event: { organizer_id: { in: organizerIds } } },
	});

	// (B) 刪除與產品相關的資料 (Product, EventsProducts, ProductVariant)
	// 先找出與這些 Organizer 活動相關的 Product IDs
	const productsToDelete = await prisma.product.findMany({
		where: {
			eventLinks: {
				some: {
					event: { organizer_id: { in: organizerIds } },
				},
			},
		},
		select: { id: true },
	});
	const productIdsToDelete = productsToDelete.map(p => p.id);

	if (productIdsToDelete.length > 0) {
		// 1. 刪除 ProductVariant (依賴 Product)
		await prisma.productVariant.deleteMany({
			where: { product_id: { in: productIdsToDelete } },
		});

		// 2. 刪除 EventsProducts (關聯表)
		await prisma.eventsProducts.deleteMany({
			where: { product_id: { in: productIdsToDelete } },
		});

		// 3. 刪除 Product (父表)
		await prisma.product.deleteMany({
			where: { id: { in: productIdsToDelete } },
		});
	}

	// (C) 刪除與圖片相關的資料 (EventImage, Image)
	// 先找出與這些 Organizer 活動相關的 Image IDs
	const imagesToDelete = await prisma.image.findMany({
		where: {
			eventLinks: {
				some: {
					event: { organizer_id: { in: organizerIds } },
				},
			},
		},
		select: { id: true },
	});
	const imageIdsToDelete = imagesToDelete.map(img => img.id);

	if (imageIdsToDelete.length > 0) {
		// 1. 刪除 EventImage (關聯表)
		await prisma.eventImage.deleteMany({
			where: { image_id: { in: imageIdsToDelete } },
		});

		// 2. 刪除 Image (父表)
		await prisma.image.deleteMany({
			where: { id: { in: imageIdsToDelete } },
		});
	}

	// (D) 刪除「活動」(Event)
	await prisma.event.deleteMany({
		where: { organizer_id: { in: organizerIds } },
	});

	console.log('✅ 舊資料清除完畢。');

	// -----------------------------------------------
	// 5️⃣ 迴圈建立新活動 (Mock Data) - 平均分配給 12 個組織
	// -----------------------------------------------
	console.log('🎟️  正在建立活動假資料...');

	let eventCounter = 0;

	for (const categoryName in eventsByCategory) {
		const eventsToCreate = eventsByCategory[categoryName];

		if (eventsToCreate.length === 0) continue;

		const category = await prisma.category.findFirst({
			where: { name: categoryName },
		});
		if (!category) continue;

		for (const eventData of eventsToCreate) {
			const data = eventData as any;

			// 輪流分配主辦單位 (Round-robin)
			const assignedOrganizer =
				createdOrganizers[eventCounter % createdOrganizers.length];
			eventCounter++;

			const completeEventData: Prisma.EventCreateInput = {
				...data,
				// 經緯度無需在此轉換，mock-events.ts 中已轉為 Decimal
				organizer: {
					connect: { id: assignedOrganizer.id },
				},
				category: {
					connect: { id: category.id },
				},
				ticketTypes: data.ticketTypes,
				productLinks: data.productLinks,
				images: data.images,
			};

			await prisma.event.create({
				data: completeEventData,
			});

			console.log(
				`  - [${assignedOrganizer.org_name}] 建立活動: ${eventData.title}`,
			);
		}
	}
}

// 執行 main 函式
main()
	.then(async () => {
		await prisma.$disconnect();
		console.log('✨ Seeding 流程全部完成！');
	})
	.catch(async e => {
		console.error('❌ Seeding 失敗：', e);
		await prisma.$disconnect();
		process.exit(1);
	});
