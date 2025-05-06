import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/context/theme-context";
import { ErrorBoundary } from "@/components/error-boundary";
import Script from "next/script";
import Link from "next/link";

const APP_NAME = "SIMPLE";
const APP_DESCRIPTION = "Ciberseguridad Simple";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// This viewport configuration will cascade to all pages
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default:
      "SIMPLE - Evaluación de Ciberseguridad para Pequeñas y Medianas Empresas",
    template: "%s | SIMPLE",
  },
  description:
    "Evaluación de seguridad informática para pequeñas y medianas empresas",
  applicationName: APP_NAME,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SIMPLE App",
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
  },
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <Script src="/sw-register.js" strategy="afterInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <ErrorBoundary
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
                  <p className="mb-4">
                    Hemos encontrado un error inesperado. Por favor, inténtalo
                    de nuevo o contacta con soporte si el problema persiste.
                  </p>
                  <Link
                    href="/"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Volver al Inicio
                  </Link>
                </div>
              </div>
            }
          >
            <AuthProvider>
              <QueryProvider>
                {children}
                <Toaster />
              </QueryProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
