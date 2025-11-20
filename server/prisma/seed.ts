// prisma/seed.ts
import { PrismaClient, Role } from "../src/generated/prisma/client.js"; // [!] 修正 Role 的 import
import bcrypt from "bcrypt";
import { eventsByCategory } from "./mock-events.js";
import { Prisma } from "../src/generated/prisma/client.js";

const categories = [
  "課程", "展覽", "派對", "聚會", "市集", "比賽",
  "表演", "研討會", "分享會", "見面會", "宣傳活動", "導覽", "體驗",
].map((name) => ({ name }));

const prisma = new PrismaClient();

async function seedAdmin() {
  // ... (seedAdmin 函式保持不變)
  console.log("🌱 正在開始管理員 Seeding...");
  const adminEmail = "admin@example.com";
  const adminPassword = "password123"; 

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password_hash: hashedPassword,
        name: "Admin",
      },
    });
    console.log(`✅ 成功建立管理員帳號: ${adminEmail}`);
  } else {
    console.log("ℹ️ 管理員帳號已存在，跳過建立。");
  }
}

const ORGANIZER_ID = "00000000-0000-0000-0000-000000000001";
const USER_ID = "00000000-0000-0000-0000-000000000002";

async function main() {
  console.log("🌱 正在開始類別 Seeding...");

  // 1️⃣ 插入活動類別 (保持不變)
  const result = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
  console.log(`✅ 成功插入/跳過 ${result.count} 個活動類別。`);

  // 呼叫建立管理員的函式 (保持不變)
  await seedAdmin();

  // 2️⃣ 建立測試用使用者 (保持不變)
  console.log("👤 建立測試用 User...");
  await prisma.user.upsert({
    where: { id: USER_ID },
    update: {},
    create: {
      id: USER_ID,
      email: "demo@linkup.test",
      password_hash: "mock_hash", 
      name: "Demo Organizer User",
      role: Role.ORGANIZER, // [!] 使用 import 的 Role
      is_active: true,
    },
  });

  // 3️⃣ 建立測試用 Organizer (保持不變)
  console.log("🏢 建立測試用 Organizer...");
  const organizer = await prisma.organizer.upsert({
    where: { id: ORGANIZER_ID },
    update: {},
    create: {
      id: ORGANIZER_ID,
      user_id: USER_ID,
      org_name: "LinkUp Demo 組織",
      is_verified: true,
    },
  });
  console.log("✅ Mock Organizer 資料已建立:", organizer.id);

  // -----------------------------------------------
  // [!!!] 4. 關鍵修正：
  // [!!!] 我們必須在刪除 "Event" 之前，先刪除所有 "依賴" Event 的 "子表" 紀錄
  // -----------------------------------------------
  
  console.log("🧹 正在清除舊的假資料 (Events, Tickets, Products)...");

  // 1. 刪除「票種」(TicketType) - 依賴 Event
  // [!] (修正：我們只刪除 "這個" 假主辦方的活動票券)
  await prisma.ticketType.deleteMany({
    where: { event: { organizer_id: organizer.id } }
  });

  // 2. 刪除「活動-商品 關聯表」(EventsProducts) - 依賴 Event
  // [!] (這就是您 Gemi-461 中 "遺漏" 的步驟)
  await prisma.eventsProducts.deleteMany({
    where: { event: { organizer_id: organizer.id } }
  });
  
  // 3. (可選) 刪除「商品規格」(ProductVariant) - 依賴 Product
  // (這一步很複雜，因為 Product 和 Event 是多對多。
  // 為了簡化 Seeding，我們假設 Product 是跟著 Event 建立的，所以我們也該刪除它們)
  
  // (找到這個主辦方 "建立" 的所有商品 ID)
  const productsToDelete = await prisma.product.findMany({
    where: {
      eventLinks: { // 找到所有 "曾經" 連結到
        some: {
          event: { organizer_id: organizer.id } // "這個" 主辦方的活動
        }
      }
    },
    select: { id: true }
  });
  const productIdsToDelete = productsToDelete.map(p => p.id);

  if (productIdsToDelete.length > 0) {
    // 刪除「商品規格」(ProductVariant) - 子表
    await prisma.productVariant.deleteMany({
      where: { product_id: { in: productIdsToDelete } }
    });
    
    // 刪除「商品」(Product) - 父表
    await prisma.product.deleteMany({
      where: { id: { in: productIdsToDelete } }
    });
  }

  // 4. 刪除「活動」(Event) - 父表
  // (這就是 Gemi-461 中出錯的第 94 行)
  await prisma.event.deleteMany({
    where: { organizer_id: organizer.id }
  });

  console.log("✅ 舊資料清除完畢。");

  // -----------------------------------------------
  // 5. 新增：迴圈建立活動 (保持不變)
  // -----------------------------------------------
  console.log("🎟️  正在建立活動假資料...");
  
  for (const categoryName in eventsByCategory) {
    const eventsToCreate = eventsByCategory[categoryName];
    if (eventsToCreate.length === 0) {
      console.warn(`⚠️  分類 "${categoryName}" 沒有假資料，已跳過。`);
      continue;
    }
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      console.warn(`❌ 錯誤：在資料庫中找不到分類 "${categoryName}"，跳過此分類下的活動。`);
      continue;
    }

    for (const eventData of eventsToCreate) {
      const data = eventData as any;
      const completeEventData: Prisma.EventCreateInput = {
        ...data,
        // [!] 確保 Gemi-461 的 `products` 欄位名稱是 `productLinks`
        // (Gemi-461 是 "productLinks"，所以這裡不用改)
        latitude: new Prisma.Decimal(data.latitude),
        longitude: new Prisma.Decimal(data.longitude),
        organizer: {
          connect: { id: organizer.id }
        },
        category: {
          connect: { id: category.id }
        },
        ticketTypes: data.ticketTypes,
        productLinks: data.productLinks, // [!] 把 Gemi-461 的資料傳進來
      };

      await prisma.event.create({
        data: completeEventData,
      });

      console.log(`  - 成功建立活動: ${eventData.title} (分類: ${categoryName})`);
    }
  }
}

// (main() 呼叫保持不變)
main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✨ Seeding 流程完成。");
  })
  .catch(async (e) => {
    console.error("❌ Seeding 失敗：", e);
    await prisma.$disconnect();
    process.exit(1);
  });