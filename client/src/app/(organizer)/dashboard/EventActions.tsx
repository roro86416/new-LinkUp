'use client';

import { useRouter } from 'next/navigation';
import { Button, Group, Menu, ActionIcon } from '@mantine/core';
import { IconDots, IconEye, IconPencil } from '@tabler/icons-react';

interface Props {
  eventId: number;
}

export default function EventActions({ eventId }: Props) {
  const router = useRouter();

  const goDetail = () => {
    router.push(`/events/${eventId}`);
  };

  const goEdit = () => {
    router.push(`/events/${eventId}/edit`);
  };

  return (
    <Group gap="xs" justify="flex-start">
      {/* 大一點的畫面：直接顯示按鈕 */}
      <Group gap="xs" visibleFrom="sm">
        <Button
          size="xs"
          variant="light"
          radius="xl"
          leftSection={<IconEye size={14} />}
          onClick={goDetail}
        >
          詳情
        </Button>

        <Button
          size="xs"
          variant="outline"
          radius="xl"
          leftSection={<IconPencil size={14} />}
          onClick={goEdit}
        >
          編輯
        </Button>
      </Group>

      {/* 小螢幕：改成一顆 menu */}
      <Menu withinPortal position="bottom-end" shadow="md" hiddenFrom="sm">
        <Menu.Target>
          <ActionIcon variant="subtle" aria-label="更多操作">
            <IconDots size={16} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEye size={14} />}
            onClick={goDetail}
          >
            查看詳情
          </Menu.Item>
          <Menu.Item
            leftSection={<IconPencil size={14} />}
            onClick={goEdit}
          >
            編輯活動
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}