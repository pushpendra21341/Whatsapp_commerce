// app/layout.tsx

import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "./theme-provider";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

// Default site metadata
const SITE_TITLE = "COBRA TRADERS";
const SITE_DESCRIPTION = "COBRA TRADERS - High quality products for your needs.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_IMAGE = `${SITE_URL}/og-image.png`; // Replace with a default Open Graph image

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <Head>
        {/* Basic Metadata */}
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:image" content={SITE_IMAGE} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={SITE_IMAGE} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body className="font-body bg-[var(--bg)] text-[var(--text-primary)]">
        <ThemeProvider>
          <Providers>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1f1f1f",
                  color: "#fff",
                  border: "1px solid #d4af37",
                },
              }}
            />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}