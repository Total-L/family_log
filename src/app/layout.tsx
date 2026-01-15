import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "亲情时光 - Family Memory",
  description: "A digital memory bank for the family.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased pb-20">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
