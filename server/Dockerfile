# 使用輕量級的 Node.js 20 環境
FROM node:20-slim

# 安裝 pnpm 以及 Prisma 所需的 OpenSSL 底層套件
RUN npm install -g pnpm
RUN apt-get update -y && apt-get install -y openssl

# 設定容器內的工作目錄
WORKDIR /app

# 複製依賴檔並安裝套件
COPY package.json ./
RUN pnpm install

# 複製所有後端程式碼
COPY . .

# 產生 Prisma Client (拔除 pnpm run build)
RUN pnpm prisma generate

# Cloud Run 預設對外開放的 Port 號為 8080
ENV PORT=8080
EXPOSE 8080

# 直接使用 tsx 執行原始碼，避開 tsc 的嚴格型別與路徑檢查
CMD ["pnpm", "tsx", "src/index.ts"]