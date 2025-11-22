// client/src/app/organizer/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
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
import { IoGrid, IoCalendar, IoAdd, IoSettings } from 'react-icons/io5';

import { useUser } from '../../context/auth/UserContext';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();

  const isOrganizer = user?.role === 'ORGANIZER';

  // ✅ [新增] 目前是否在 apply 頁
  const isApplyPage = pathname?.startsWith('/organizer/apply');

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    // ✅ [修改] 不是 organizer 但「不是 apply 頁」才導向 apply
    if (!isOrganizer && !isApplyPage) {
      router.replace('/organizer/apply');
      return;
    }
  }, [loading, user, isOrganizer, isApplyPage, router]);

  // ✅ loading 中 or 非主辦方且不是 apply 頁 → 才顯示擋路畫面
  if (loading || !user || (!isOrganizer && !isApplyPage)) {
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

  // ✅ [新增] apply 頁就不要顯示後台殼（側欄/頂欄），直接顯示內容
  if (isApplyPage && !isOrganizer) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const navLinks = [
    { icon: IoGrid, label: '總覽', href: '/organizer/dashboard' },
    { icon: IoCalendar, label: '活動列表', href: '/organizer/events' },
    { icon: IoAdd, label: '建立活動', href: '/organizer/events/new' },
    { icon: IoSettings, label: '帳戶設定', href: '/organizer/settings' },
  ];

  const isLinkActive = (href: string) => {
    if (!pathname) return false;

    if (href === '/organizer/events') {
      return (
        pathname === '/organizer/events' ||
        (pathname.startsWith('/organizer/events/') &&
          !pathname.startsWith('/organizer/events/new'))
      );
    }

    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleNavClick = () => {
    if (opened) close();
  };

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