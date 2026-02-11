import type React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Cozy Bites Kitchen - Easy & Comfort Recipes for Everyday Cooking",
  description:
    "Easy, cozy, and delicious homemade recipes for everyday cooking. Quick meals, comfort dishes, family dinners, and simple home-style favorites.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://cozybiteskitchen.com",
  ),
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const EZOIC_ENABLED = process.env.NEXT_PUBLIC_EZOIC_ENABLED === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ========================= */}
        {/* 💰 GOOGLE ADSENSE (AFTER EZOIC) */}
        {/* ========================= */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6971476027163147"
          crossOrigin="anonymous"
        ></script>

        {/* ========================= */}
        {/* 📊 GOOGLE ANALYTICS */}
        {/* ========================= */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* ========================= */}
        {/* 🌱 GROW.ME - Social Growth Tool */}
        {/* ========================= */}
        <Script
          id="grow-me"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      !(function(){
        window.growMe || (
          (window.growMe = function(e){
            window.growMe._.push(e);
          }),
          (window.growMe._ = [])
        );
        var e = document.createElement("script");
        e.type = "text/javascript";
        e.src = "https://faves.grow.me/main.js";
        e.defer = true;
        e.setAttribute(
          "data-grow-faves-site-id",
          "U2l0ZTo0NTdiZDRhNS0zMWJmLTQ4MGUtYTFkOC03NzM2MjVlZDNlMDk="
        );
        var t = document.getElementsByTagName("script")[0];
        t.parentNode.insertBefore(e, t);
      })();
    `,
          }}
          data-grow-initializer=""
        />

        {/* ========================= */}
        {/* ⚡ Performance Optimizations */}
        {/* ========================= */}

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Pinterest Verification */}
        <meta
          name="p:domain_verify"
          content="89f31719aad6db043644d92d55d205f2"
        />
      </head>

      <body className="antialiased font-sans">
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>

        <SpeedInsights />
      </body>
    </html>
  );
}
