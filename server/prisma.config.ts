import dotenv from "dotenv";
dotenv.config(); // ✅ 強制載入 .env

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
