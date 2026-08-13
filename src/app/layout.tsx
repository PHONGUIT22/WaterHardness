import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://waterhardness.uk"),
  title: {
    default: "UK Water Hardness Checker & Appliance Salt Settings | WaterHardness.uk",
    template: "%s | WaterHardness.uk"
  },
  description: "Instant water hardness insights (PPM, Clark Degrees) for 1.7M+ UK postcodes. Find dishwasher salt settings & limescale risks for Bosch, Beko, Miele & more.",
  icons: {
    icon: "/icon.webp",
    shortcut: "/icon.webp",
    apple: "/icon.webp",
  },
  authors: [{ name: "Nguyễn Hạc Phong", url: "https://waterhardness.uk/about" }],
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
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://waterhardness.uk",
    title: "UK Water Hardness Checker & Appliance Salt Settings",
    description: "Check water hardness (PPM & Clark degrees), limescale risk & dishwasher salt settings across 1.7M+ UK postcodes.",
    siteName: "WaterHardness.uk",
    images: [
      {
        url: "https://waterhardness.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "WaterHardness.uk Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Water Hardness Checker & Postcode Analytics",
    description: "Find water hardness (PPM), limescale risk and dishwasher settings across all UK postcodes.",
    images: ["https://waterhardness.uk/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://waterhardness.uk/#organization",
                  "name": "WaterHardness",
                  "alternateName": "WaterHardness.uk",
                  "url": "https://waterhardness.uk",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://waterhardness.uk/logo.png"
                  },
                  "description": "WaterHardness.uk provides localized UK water hardness analytics, limescale risk assessments, and appliance salt settings across all UK postcodes.",
                  "founder": {
                    "@id": "https://waterhardness.uk/#person"
                  },
                  "sameAs": [
                    "https://www.facebook.com/profile.php?id=61593468350046",
                    "https://gravatar.com/quicklyimpossible45dfc1b37d"
                  ]
                },
                {
                  "@type": "Person",
                  "@id": "https://waterhardness.uk/#person",
                  "name": "Nguyễn Hạc Phong",
                  "url": "https://waterhardness.uk/about",
                  "jobTitle": "Founder & Data Engineer",
                  "description": "Software & Data Engineer specializing in UK environmental water analytics and web architecture.",
                  "alumniOf": {
                    "@type": "CollegeOrUniversity",
                    "name": "University of Information Technology (UIT)"
                  },
                  "worksFor": {
                    "@id": "https://waterhardness.uk/#organization"
                  },
                  "sameAs": [
                    "https://www.facebook.com/phong.nguyen.916206/",
                    "https://github.com/KoVN-s",
                    "https://www.linkedin.com/in/nguy%E1%BB%85n-phong-a673681b5/"
                  ],
                  "knowsAbout": [
                    "Data Analytics",
                    "Software Engineering",
                    "Next.js & PostgreSQL",
                    "UK Water Supply Quality",
                    "Programmatic SEO"
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#FDFDFD] text-slate-900 antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}