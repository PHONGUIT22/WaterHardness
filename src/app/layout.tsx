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
    default: "UK Water Hardness & Salt Checker | WaterHardness.uk",
    template: "%s | WaterHardness.uk"
  },
  description: "Instant UK water hardness lookup (PPM & Clark). Check local limescale risks, boiler efficiency penalties & appliance dishwasher salt settings.",
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
    title: "UK Water Hardness & Salt Checker",
    description: "Lookup water hardness (PPM & Clark) across UK postcodes. Check limescale risks and appliance dishwasher salt settings.",
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
    title: "UK Water Hardness & Salt Checker",
    description: "Lookup water hardness (PPM & Clark) across UK postcodes. Check limescale risks and appliance dishwasher salt settings.",
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
                  "@type": "WebSite",
                  "@id": "https://waterhardness.uk/#website",
                  "url": "https://waterhardness.uk",
                  "name": "WaterHardness.uk",
                  "publisher": {
                    "@id": "https://waterhardness.uk/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://waterhardness.uk/water-hardness/{search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
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