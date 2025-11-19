'use client';

import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoGrid, IoCalendar, IoAdd, IoSettings } from 'react-icons/io5';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  const navLinks = [
    { icon: IoGrid, label: '總覽', href: '/dashboard' },
    { icon: IoCalendar, label: '活動列表', href: '/events' },
    { icon: IoAdd, label: '建立活動', href: '/events/new' },
    { icon: IoSettings, label: '帳戶設定', href: '/settings' },
  ];

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
            active={pathname === link.href || pathname?.startsWith(link.href)}
            onClick={toggle}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}