import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EmployeeProvider } from "../contexts/EmployeeContext";
import { LoadingProvider } from "../contexts/LoadingContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { Toaster } from "sonner";

// フォントの設定
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// メタデータの設定
export const metadata: Metadata = {
  title: "社員ディレクトリ",
  description: "社員情報管理システム",
};

// ルートレイアウトコンポーネント
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`h-full ${inter.variable}`}>
      <body className={`${inter.className} h-full`}>
        <LoadingProvider>
          <EmployeeProvider>
            {children}
            <LoadingIndicator />
            <Toaster
              richColors
              position="bottom-right"
              expand={true}
              closeButton
            />
          </EmployeeProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
