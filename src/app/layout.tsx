import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "游戏盒子 - 您的一站式游戏平台",
  description: "发现、购买和游玩您喜爱的游戏，参与一个充满活力的游戏社区",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
