'use client';

import { useEffect } from 'react';
import { useModal } from '../../context/auth/ModalContext';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const { openAdminLogin } = useModal();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.push('/admin');
    } else {
      openAdminLogin();
    }
  }, [openAdminLogin, router]);

  return null;
}