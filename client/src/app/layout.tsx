// app/layout.tsx

import './globals.css';
import "@mantine/core/styles.css";
// [新增 1] 引入 ColorSchemeScript
import { ColorSchemeScript } from '@mantine/core';
import { UserProvider } from '../context/auth/UserContext';
import { ModalProvider } from '../context/auth/ModalContext';
import { AdminUserProvider } from '../context/auth/AdminUserContext';
import { FavoritesProvider } from '../components/content/member/FavoritesContext';
import { CouponsProvider } from '../components/content/member/CouponsContext';
import HeaderWrapper from './HeaderWrapper';
import Footer from '../components/Footer';
import LoginModal from '../components/modals/auth/LoginModal';
import EmailLoginModal from '../components/modals/auth/EmailLoginModal';
import RegisterModal from '../components/modals/auth/RegisterModal';
import ForgotPasswordModal from '../components/modals/auth/ForgotPasswordModal';
import PasswordSentModal from '../components/modals/auth/PasswordSentModal';
import AdminLoginModal from '../components/modals/auth/AdminLoginModal';
import { Toaster } from 'react-hot-toast';
// [注意] 請確認此路徑與您的檔案名稱大小寫一致 (例如 mantineProviders.tsx 或 MantineProviders.tsx)
import MantineProviders from '../providers/MantineProviders';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata = {
  title: "LinkUp | 連結每一個精彩瞬間",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        {/* [新增 2] 加入 ColorSchemeScript 以支援 Mantine 主題 */}
        <ColorSchemeScript />
      </head>
      <body className="bg-white">
        {/* [新增 3] 使用 MantineProviders 包裹所有內容 */}
        <MantineProviders>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <AdminUserProvider>
            <UserProvider>
              <GoogleOAuthProvider clientId="851448034728-23otj2ua4rlpr8km64lgfi0l4r3b6vni.apps.googleusercontent.com">
              <ModalProvider>
                <CouponsProvider>
                  <FavoritesProvider>
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
                    <div id="modal-root"></div>
                    <Footer />
                  </FavoritesProvider>
                </CouponsProvider>
              </ModalProvider>
              </GoogleOAuthProvider>
            </UserProvider>
          </AdminUserProvider>
        </MantineProviders>
      </body>
    </html>
  );
}