"use client";

import { MantineProvider } from "@mantine/core";

export default function MantineProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}

/* 使用說明:
Mantine 官方在 Next.js App Router 使用方式很固定，就是：
1. 在 layout.tsx 的 <body> 裡把所有子頁面包起來
2. MantineProvider 是 Client Component，所以 layout.tsx 需要「部分 Client 化」
*/