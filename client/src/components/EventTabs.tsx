"use client";

import { Paper, Tabs, Title, Text, Group, Button } from "@mantine/core";
import { IconHeart, IconMail, IconShare } from "@tabler/icons-react";

export default function EventTabs() {
  return (
    <Group justify="space-between" mt="xl" align="flex-start" w="100%">
      <Tabs defaultValue="intro">
        <Tabs.List>
          <Tabs.Tab value="intro">活動介紹</Tabs.Tab>
          <Tabs.Tab value="weather">活動天氣</Tabs.Tab>
          <Tabs.Tab value="comments">評論區</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="intro" pt="md">
          <Paper p={24} withBorder radius="md" mt="md">
            <Title order={4}>活動介紹</Title>
            <Text mt="sm">這裡以後會呈現 event.description，目前是 placeholder。</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="weather" pt="md">
          <Paper p={24} withBorder radius="md" mt="md">
            <Title order={4}>活動天氣</Title>
            <Text mt="sm">API 串接後顯示天氣，目前為空白 Layout。</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="comments" pt="md">
          <Paper p={24} withBorder radius="md" mt="md">
            <Title order={4}>評論區</Title>
            <Text mt="sm">未串接評論資料，目前為 Layout。</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
      
      {/* Tabs 右側動作按鈕 */}
      <Group>
        <Button variant="light">立即報名</Button>
        <Button variant="default"><IconHeart size={18} /></Button>
        <Button variant="default"><IconMail size={18} /></Button>
        <Button variant="default"><IconShare size={18} /></Button>
      </Group>
    </Group>
  );
}
