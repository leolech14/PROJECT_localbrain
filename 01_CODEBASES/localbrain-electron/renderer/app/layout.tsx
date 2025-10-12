import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../contexts/AppContext";
import { QueryProvider, prefetchQueries } from "../components/QueryProvider";
import { getQueryClient } from "../lib/queryClient";
import { DemoNav } from "../components/DemoNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalBrain - AI Chat Client",
  description: "Multi-provider AI chat with advanced context management",
};

// SSR data prefetching function
async function prefetchServerData() {
  const queryClient = getQueryClient();

  try {
    // Prefetch essential data during SSR
    await prefetchQueries(queryClient);
  } catch (error) {
    console.warn('SSR prefetch failed:', error);
    // Continue without prefetching - client will handle data fetching
  }

  return queryClient;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Prefetch data on server
  const queryClient = await prefetchServerData();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider client={queryClient}>
          <DemoNav />
          <AppProvider>{children}</AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
