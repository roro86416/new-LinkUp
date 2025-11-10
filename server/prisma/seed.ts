// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";



// 活動類別（不指定 id，讓 DB 自動生成）
const categories = [
  "課程",
  "展覽",
  "派對",
  "聚會",
  "市集",
  "比賽",
  "表演",
  "研討會",
  "分享會",
  "見面會",
  "宣傳活動",
  "導覽",
  "體驗",
].map((name) => ({ name }));

const prisma = new PrismaClient();

// 建立管理員帳號的函式
async function seedAdmin() {
  console.log("🌱 正在開始管理員 Seeding...");

  const adminEmail = "admin@example.com";
  const adminPassword = "password123"; // 請在正式環境使用更安全的密碼

  // 檢查管理員是否已存在
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

// 固定 organizer/user ID，用來對應 service 中 MOCK_ORGANIZER_ID
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
      password_hash: "mock_hash", // 這裡放假的密碼雜湊
      name: "Demo Organizer User",
      role: "ORGANIZER",
      is_active: true,
    },
  });

  // 3️⃣ 建立測試用 Organizer
  console.log("🏢 建立測試用 Organizer...");
  await prisma.organizer.upsert({
    where: { id: ORGANIZER_ID },
    update: {},
    create: {
      id: ORGANIZER_ID,
      user_id: USER_ID,
      org_name: "LinkUp Demo 組織",
      is_verified: true,
    },
  });

  console.log("✅ Mock Organizer 資料已建立:", ORGANIZER_ID);
}

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