import './globals.css';
import { UserProvider } from '../context/auth/UserContext';
import { ModalProvider } from '../context/auth/ModalContext';
import HeaderWrapper from '../components/layout/HeaderWrapper';
import Footer from '../components/Footer';
import LoginModal from '../components/modals/auth/LoginModal';
import EmailLoginModal from '../components/modals/auth/EmailLoginModal';
import RegisterModal from '../components/modals/auth/RegisterModal';
import ForgotPasswordModal from '../components/modals/auth/ForgotPasswordModal';
import PasswordSentModal from '../components/modals/auth/PasswordSentModal';
import AdminLoginModal from '../components/modals/auth/AdminLoginModal';
import { Toaster } from 'react-hot-toast';
import MantineProviders from '../providers/MantineProviders'

export const metadata = {
  title: 'LinkUp 報名系統',
  description: '活動報名平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="bg-white">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000, 
          }}
        />
        <UserProvider>
          <ModalProvider>
            <HeaderWrapper />
              <MantineProviders>
                <main className="w-full justify-center m-0 p-0 min-h-screen">
                  {children}
                </main>
              </MantineProviders>
            <LoginModal />
            <EmailLoginModal />
            <RegisterModal />
            <ForgotPasswordModal />
            <PasswordSentModal />
            <AdminLoginModal />
            <Footer />
          </ModalProvider>
        </UserProvider>
      </body>
    </html>
  );
}