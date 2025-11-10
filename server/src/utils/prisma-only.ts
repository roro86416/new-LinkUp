import { PrismaClient } from "../generated/prisma/client.js";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 在開發環境中，使用 globalThis 來快取 PrismaClient 實例，
// 避免在熱重載時重複建立。
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
