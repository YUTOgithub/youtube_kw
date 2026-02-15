import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { KeywordProvider } from "@/context/KeywordContext";

export const metadata: Metadata = {
  title: "検索ワードをお気に入り登録",
  description: "チャンネルごとではなく、検索ワードごとに管理できるサイトです",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gradient-to-br from-purple-500 to-purple-700 min-h-screen p-5">
        <AuthProvider>
          <KeywordProvider>
            {children}
          </KeywordProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
