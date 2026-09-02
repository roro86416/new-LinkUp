# 使用輕量級的 Node.js 20 環境
FROM node:20-slim

# 安裝 pnpm 以及 Prisma 所需的 OpenSSL 底層套件
RUN npm install -g pnpm
RUN apt-get update -y && apt-get install -y openssl

# 設定容器內的工作目錄
WORKDIR /app

# 複製依賴檔並安裝套件 (利用快取機制加速部署)
COPY package.json ./
RUN pnpm install

# 複製所有後端程式碼
COPY . .

# 產生 Prisma Client 並編譯 TypeScript
RUN pnpm prisma generate
RUN pnpm run build

# Cloud Run 預設對外開放的 Port 號為 8080
ENV PORT=8080
EXPOSE 8080

# 啟動伺服器
CMD ["pnpm", "run", "start"]