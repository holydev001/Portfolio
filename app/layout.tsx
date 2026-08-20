import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://holydev.cv";
const siteName = "holy.dev";
const siteTitle = "David Adams (holydev) — Full-Stack Developer";
const siteDescription =
  "Portfolio of David Adams, also known as Priest and holydev — a full-stack developer in Nigeria building thoughtful, performant web applications and digital products.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Priest",
    "holydev",
    "holydev001",
    "David Adams",
    "full-stack developer Nigeria",
    "React developer",
    "Next.js developer",
    "TypeScript developer",
  ],
  authors: [{ name: "David Adams" }],
  creator: "David Adams",
  publisher: "David Adams",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "en_US",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1920,
        height: 1080,
        alt: "Priest / David Adams — Holydev portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@holydev0001",
    creator: "@holydev0001",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "David Adams",
      alternateName: ["Priest", "holydev", "holydev001", "holy.dev"],
      url: siteUrl,
      image: `${siteUrl}/og-image.png`,
      jobTitle: "Full-Stack Developer",
      worksFor: { "@type": "Organization", name: "Emerj LLC" },
      address: { "@type": "PostalAddress", addressCountry: "NG" },
      sameAs: ["https://github.com/holydev001", "https://x.com/holydev0001"],
      knowsAbout: [
        "React",
        "TanStack Start",
        "TanStack Router",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "Full-Stack Development",
        "Frontend Development",
        "Web Performance",
        "SEO",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=JetBrains+Mono:wght@400;600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
