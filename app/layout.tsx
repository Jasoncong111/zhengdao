import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "证道 ZhengDao - 基于区块链的打卡激励系统",
  description: "修身、齐家、证道 - 通过区块链激励养成持续习惯",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "证道",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="证道" />
      </head>
      <body className="bg-paper text-ink antialiased">
        <Providers>
          {/* Mobile Screen Container - Centered with max width */}
          <div className="min-h-screen flex justify-center bg-paper">
            <main className="w-full max-w-[430px] bg-paper relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
