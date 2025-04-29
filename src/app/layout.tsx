import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/context/theme-context";
import Script from "next/script";

const APP_NAME = "SIMPLE";
const APP_DESCRIPTION = "Your Mind's Best Friend";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
    other: {
      rel: "apple-touch-icon",
      url: "/apple-icon.png",
    },
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <Script src="/sw-register.js" strategy="afterInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>

        <Script id="performance-metrics" strategy="afterInteractive">
          {`
            // Simple performance metrics
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach((entry) => {
                if (entry.entryType === 'largest-contentful-paint') {
                  console.log('LCP:', entry.startTime);
                }
                if (entry.entryType === 'layout-shift') {
                  console.log('CLS contribution:', entry.value);
                }
              });
            });
            observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
          `}
        </Script>
      </body>
    </html>
  );
}
