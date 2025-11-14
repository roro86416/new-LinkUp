//
// ⚠️ 注意：此檔案的 import 路徑是 "../src/generated/prisma/client.js"
//
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

// 將 Category 陣列定義移到最上面
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

async function main() {
  // --- 1. 清除所有舊資料 (確保 seed 可重複執行) ---
  // (你新增的邏輯，非常棒！)
  console.log("🧹 正在清除所有舊資料...");
  await prisma.$transaction([
    prisma.cartItem.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.ticketType.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.event.deleteMany(),
    prisma.category.deleteMany(),
    prisma.product.deleteMany(),
    prisma.organizer.deleteMany(),
    prisma.user.deleteMany({ where: { role: "ORGANIZER" } }),
  ]);
  console.log("🧹 已清除舊的測試資料。");

  // --- 2. 重新 Seeding 活動類別 (Categories) ---
  console.log("🌱 正在開始 Seeding 活動類別...");
  const categoryResult = await prisma.category.createMany({
    data: categories,
    skipDuplicates: false, // 因為我們先清空了，所以不需要 skip
  });
  console.log(`✅ 成功插入 ${categoryResult.count} 筆活動類別。`);

  // --- 3. Seeding 測試資料 (用於 API 測試) ---
  console.log("🌱 正在開始 Seeding 測試用的主辦方、活動、票券和商品...");

  // (B) 建立一個假的主辦方 (User + Organizer)
  const testOrganizerUser = await prisma.user.create({
    data: {
      name: "測試主辦方",
      email: "organizer@test.com",
      role: "ORGANIZER", //
      organizer: {
        create: {
          org_name: "LinkUp 官方測試",
        },
      },
    },
    include: {
      organizer: {
        select: { id: true },
      },
    },
  });
  const organizerId = testOrganizerUser.organizer!.id; // 這是 String (uuid)
  console.log(
    `👤 已建立主辦方: ${testOrganizerUser.name} (Organizer ID: ${organizerId})`
  );

  // (C) 取得一個已存在的 Category (用於建立活動)
  const testCategory = await prisma.category.findFirst({
    where: { name: "研討會" },
  });
  if (!testCategory) {
    // 這裡的錯誤現在是合理的，因為如果 "研討會" 不在陣列中，就該報錯
    throw new Error("找不到 '研討會' 類別，請確認 Category 陣列包含 '研討會'");
  }

  // (D) 建立一個假的活動 (Event)
  const testEvent = await prisma.event.create({
    data: {
      organizer_id: organizerId, //
      title: "測試活動：LinkUp 開發者研討會",
      description: "一場關於 Prisma 和 S-C-R 架構的研討會",
      cover_image: "https://example.com/cover.jpg",
      start_time: new Date("2025-12-01T09:00:00Z"),
      end_time: new Date("2025-12-01T17:00:00Z"),
      location_name: "LinkUp 總部",
      address: "台北市信義區市府路45號",
      latitude: 25.034,
      longitude: 121.564,
      status: "APPROVED", //
      event_type: "OFFLINE", //
      category_id: testCategory.id, //
    },
  });
  const eventId = testEvent.id; // 這是 Int (autoincrement)
  console.log(`🎉 已建立活動: ${testEvent.title} (Event ID: ${eventId})`);

  // (E) 建立一個假的票券 (TicketType)
  const testTicketType = await prisma.ticketType.create({
    data: {
      event_id: eventId, //
      name: "測試早鳥票",
      price: 100,
      total_quantity: 50, // 總庫存 50 張
      sale_start_time: new Date("2025-11-01T00:00:00Z"),
      sale_end_time: new Date("2025-11-30T23:59:59Z"),
    },
  });
  const ticketTypeId = testTicketType.id; // 這是 String (uuid)
  console.log(
    `🎟️  已建立票券: ${testTicketType.name} (TicketType ID: ${ticketTypeId})`
  );

  // (F) 建立一個假的商品 (Product + Variant)
  const testProduct = await prisma.product.create({
    data: {
      name: "測試商品：LinkUp 紀念 T-Shirt",
      base_price: 499,
      variants: {
        create: {
          option1_name: "尺寸",
          option1_value: "L",
          stock_quantity: 100, // 總庫存 100 件
        },
      },
    },
    include: {
      variants: true,
    },
  });
  const testVariant = testProduct.variants[0];
  const variantId = testVariant.id; // 這是 Int (autoincrement)
  console.log(
    `👕 已建立商品: ${testProduct.name} (ProductVariant ID: ${variantId})`
  );

  // --- 4. 輸出 ID (供 API 測試) ---
  console.log("\n==============================================");
  console.log("✅ 測試資料 Seeding 完成！");
  console.log("請使用以下 ID 進行購物車 API 測試：");
  console.log("==============================================");
  console.log(`Test ProductVariant ID (商品): ${variantId}`);
  console.log(`Test TicketType ID (票券):   ${ticketTypeId}`);
  console.log("==============================================\n");
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
