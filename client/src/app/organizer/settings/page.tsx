'use client';

import { Stack, Title, Text } from '@mantine/core';

export default function SettingsPage() {
  return (
    <Stack>
      <Title order={2}>帳戶設定</Title>
      <Text c="dimmed">這裡之後放主辦方帳戶資料、品牌名稱、聯絡資訊等設定表單。</Text>
    </Stack>
  );
}