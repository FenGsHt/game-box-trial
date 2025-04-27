"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "./providers";
import { Chat } from "@/components/chat/Chat";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            {/* <Footer /> */}
            <Chat />
          </div>
        </Providers>
      </body>
    </html>
  );
} 