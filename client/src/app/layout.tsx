// client/src/app/layout.tsx
import React from 'react';
// Mantine
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

// 自己的 Context / 元件
import { UserProvider } from '../context/auth/UserContext';
import { ModalProvider } from '../context/auth/ModalContext';
import HeaderWrapper from './HeaderWrapper';
import Footer from '../components/Footer';
import LoginModal from '../components/modals/auth/LoginModal';
import EmailLoginModal from '../components/modals/auth/EmailLoginModal';
import RegisterModal from '../components/modals/auth/RegisterModal';
import ForgotPasswordModal from '../components/modals/auth/ForgotPasswordModal';
import PasswordSentModal from '../components/modals/auth/PasswordSentModal';
import AdminLoginModal from '../components/modals/auth/AdminLoginModal';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'LinkUp 報名系統',
  description: '活動報名平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-white">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000, // 預設 3 秒後消失
          }}
        />

        <UserProvider>
          <ModalProvider>
            {/* MantineProvider 一定要包在最外層，讓內層所有 Mantine 元件都吃得到 Theme */}
            <MantineProvider>
              <HeaderWrapper />

              <main className="w-full justify-center m-0 p-0 min-h-screen">
                {children}
              </main>

              <LoginModal />
              <EmailLoginModal />
              <RegisterModal />
              <ForgotPasswordModal />
              <PasswordSentModal />
              <AdminLoginModal />

              <Footer />
            </MantineProvider>
          </ModalProvider>
        </UserProvider>
      </body>
    </html>
  );
}