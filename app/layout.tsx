import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "./globals.css";
import { AdminProvider } from "@/lib/admin-context";

export const metadata: Metadata = {
  title: "Brief Maker - AI Web Design Brief Generator",
  description: "Generate creative web design briefs using AI to simulate real client requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="bg-gray-50">
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
