import { Container, Paper, Stack, Title, Text, Group, Button } from "@mantine/core";
import { IconHeart, IconTag } from "@tabler/icons-react";
import EventTabs from "../../../components/EventTabs";

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id: eventId } = await params;

  return (
    <Container size="lg" py={40}>
      <Paper shadow="md" p={32} radius="md" withBorder>

        {/* ------------------------------------------------- */}
        {/* 1. Breadcrumb（目前沒有實作，所以留空即可） */}
        {/* ------------------------------------------------- */}

        {/* ------------------------------------------------- */}
        {/* 2. 活動 Cover（大 Banner 圖） ← ★ 新增區塊 */}
        {/* ------------------------------------------------- */}
        <Paper
          mt="md"
          radius="md"
          withBorder
          p={0}
          style={{ overflow: "hidden" }}
        >
          <img
            src="/placeholder-cover.jpg" 
            alt="活動封面 event.cover_image"
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Paper>

        {/* ------------------------------------------------- */}
        {/* 3. 活動標題區（大標 + 標籤 + 收藏數量） */}
        {/* ------------------------------------------------- */}
        <Stack gap="sm" mt="xl">
          <Title order={1}>活動標題 event.title</Title>

          <Group gap="xs">
            <Text size="sm">線上/線下標籤</Text>
            <Text size="sm">活動類別</Text>
            <Group gap={4}>
              <IconHeart size={18} />
              <Text size="sm">123</Text>
            </Group>
          </Group>
        </Stack>

        {/* ------------------------------------------------- */}
        {/* 4. 活動名片區（左：活動資訊 / 右：主辦方） */}
        {/* ------------------------------------------------- */}
        <Paper mt="xl" p={24} radius="md" withBorder>
          <Group justify="space-between" align="flex-start">
            
            {/* 左側：活動資訊 */}
            <Stack gap="xs">
              <Text fw={500}>📅 日期：xxxx</Text>
              <Text fw={500}>📍 地點：xxxx</Text>
              <Text fw={500}>🔗 相關連結</Text>

              <Group gap="xs">
                <Text fw={500}><IconTag size={18} /></Text>
                <Text>:</Text>
                <Text>#戶外</Text>
                <Text>#攝影</Text>
              </Group>

              <Button mt="md" variant="light">進入活動商城</Button>
            </Stack>

            {/* 右側：主辦方 */}
            <Stack align="center">
              <Paper radius="xl" p="md" withBorder>
                主辦方頭像
              </Paper>
              <Text fw={600}>主辦方名稱</Text>
            </Stack>
          </Group>
        </Paper>

        {/* ------------------------------------------------- */}
        {/* 5. Tabs 區域（整段改用 EventTabs client component） */}
        {/* ------------------------------------------------- */}
        <EventTabs />

      </Paper>
    </Container>
  );
}
