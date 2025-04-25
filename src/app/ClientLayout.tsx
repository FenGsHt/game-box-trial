"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import { appWithTranslation } from 'next-i18next';
import './i18n';
import { Chat } from "@/components/chat/Chat";

const inter = Inter({ subsets: ["latin"] });

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
            <Chat />
          </div>
        </Providers>
      </body>
    </html>
  );
}

// @ts-expect-error - Next.js wrapper type issue
export default appWithTranslation(ClientLayout); 