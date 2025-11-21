'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Title,
  LoadingOverlay,
  Center,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoGrid, IoCalendar, IoAdd, IoSettings } from 'react-icons/io5';

// ✅ 依你的專案結構：client/src/context/auth/UserContext.tsx
import { useUser } from '../../context/auth/UserContext';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();

  const isOrganizer = user?.role === 'ORGANIZER';

  // ✅ 權限守門：非主辦方不能進 organizer group
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/'); // 未登入 → 回首頁
      return;
    }

    if (!isOrganizer) {
      router.replace('/organizer/apply'); // 已登入但不是主辦方 → 去升級頁
      return;
    }
  }, [loading, user, isOrganizer, router]);

  const navLinks = [
    { icon: IoGrid, label: '總覽', href: '/dashboard' },
    { icon: IoCalendar, label: '活動列表', href: '/events' },
    { icon: IoAdd, label: '建立活動', href: '/events/new' },
    { icon: IoSettings, label: '帳戶設定', href: '/settings' },
  ];

  // ✅ 避免 /events/new 讓「活動列表」與「建立活動」同時 active
  const isLinkActive = (href: string) => {
    if (!pathname) return false;

    if (href === '/events') {
      // 活動列表：亮在 /events、/events/[id]、/events/[id]/edit
      // 但不要包含 /events/new
      return (
        pathname === '/events' ||
        (pathname.startsWith('/events/') && !pathname.startsWith('/events/new'))
      );
    }

    // 其他：精準 + 子路由
    return pathname === href || pathname.startsWith(href + '/');
  };

  // ✅ 只在 mobile 開啟時才收合 navbar
  const handleNavClick = () => {
    if (opened) close();
  };

  // ✅ loading / redirect 中的占位畫面（避免閃一下看到後台）
  if (loading || !user || !isOrganizer) {
    return (
      <div className="min-h-screen relative bg-slate-50">
        <LoadingOverlay visible />
        <Center className="min-h-screen">
          <Text c="dimmed" size="sm">
            {loading
              ? '讀取主辦方狀態中…'
              : !user
              ? '尚未登入，導向首頁中…'
              : '你還不是主辦方，導向升級頁中…'}
          </Text>
        </Center>
      </div>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={4}>LinkUp! 主辦方後台</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            component={Link}
            href={link.href}
            label={link.label}
            leftSection={<link.icon size="1rem" />}
            active={isLinkActive(link.href)}
            onClick={handleNavClick}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}