// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";
import { eventsByCategory } from "./mock-events.js";
import { Prisma } from "../src/generated/prisma/client.js";

// (您原有的 categories 陣列保持不變)
const categories = [
  "課程", "展覽", "派對", "聚會", "市集", "比賽",
  "表演", "研討會", "分享會", "見面會", "宣傳活動", "導覽", "體驗",
].map((name) => ({ name }));

const prisma = new PrismaClient();

// (您原有的 seedAdmin 函式保持不變)
async function seedAdmin() {
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

// (您原有的 ID 保持不變)
const ORGANIZER_ID = "00000000-0000-0000-0000-000000000001";
const USER_ID = "00000000-0000-0000-0000-000000000002";

async function main() {
  console.log("🌱 正在開始類別 Seeding...");

  // 1️⃣ 插入活動類別
  const result = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
  console.log(`✅ 成功插入/跳過 ${result.count} 個活動類別。`);

  // 呼叫建立管理員的函式
  await seedAdmin();

  // 2️⃣ 建立測試用使用者（Organizer 對應的 user）
  console.log("👤 建立測試用 User...");
  await prisma.user.upsert({
    where: { id: USER_ID },
    update: {},
    create: {
      id: USER_ID,
      email: "demo@linkup.test",
      password_hash: "mock_hash", 
      name: "Demo Organizer User",
      role: "ORGANIZER", // [!] 確保 Role ENUM 在 schema 中已定義
      is_active: true,
    },
  });

  // 3️⃣ 建立測試用 Organizer
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
  // 4. 新增：迴圈建立活動
  // -----------------------------------------------
  console.log("🎟️  正在建立活動假資料...");
  
  // [!] 為了避免重複建立，我們先刪除所有 "舊的" 假活動
  // (這是一個更穩健的 seeding 做法)
  await prisma.ticketType.deleteMany({}); // (必須先刪除子表)
  await prisma.event.deleteMany({
    where: { organizer_id: organizer.id } // 只刪除這個假主辦方的活動
  });
  console.log("🧹 已清除舊的假活動...");

  for (const categoryName in eventsByCategory) {
    const eventsToCreate = eventsByCategory[categoryName];

    if (eventsToCreate.length === 0) {
      console.warn(`⚠️  分類 "${categoryName}" 沒有假資料，已跳過。`);
      continue;
    }

    // (A) 從資料庫找出這個 "分類名稱" 對應的 "category.id"
    const category = await prisma.category.findFirst({ // (已修正為 findFirst)
      where: { name: categoryName },
    });

    if (!category) {
      console.warn(`❌ 錯誤：在資料庫中找不到分類 "${categoryName}"，跳過此分類下的活動。`);
      continue;
    }

    // (B) 遍歷這個分類下的所有活動，並建立它們
    for (const eventData of eventsToCreate) {
      
      const data = eventData as any;
      
      const completeEventData: Prisma.EventCreateInput = {
        ...data,
        latitude: new Prisma.Decimal(data.latitude),
        longitude: new Prisma.Decimal(data.longitude),
        organizer: {
          connect: { id: organizer.id }
        },
        category: {
          connect: { id: category.id }
        },
        ticketTypes: data.ticketTypes 
      };

      // [!!!] 
      // [!!!] 關鍵修正：
      // [!!!] 將 "upsert" 改為 "create"
      // [!!!]
      await prisma.event.create({
        data: completeEventData,
      });

      console.log(`  - 成功建立活動: ${eventData.title} (分類: ${categoryName})`);
    }
  }
}

// (您原有的 main() 呼叫保持不變)
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