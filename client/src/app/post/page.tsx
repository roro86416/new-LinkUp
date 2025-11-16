import Slider from"./post-component/layouts/FeatureSlider"
import Header from "./post-component/layouts/header"


export const metadata = {
  title: 'LinkUp 報名系統',
  description: '活動報名平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="bg-white">
        <Header/>
        <Slider/>
        {children}
      </body>

    </html>
  );
}