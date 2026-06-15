import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import { StructuredData } from "@/components/seo/structured-data";
import { SiteShell } from "@/components/website/site-shell";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";
import { buildLocalBusinessSchema, buildWebsiteSchema } from "@/lib/structured-data";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Decorative Lighting, Security & Smart Automation | Mumbai",
    description: siteConfig.description,
    path: "/",
  }),
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full dark antialiased ${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#050A14] text-[#E8EAF0]">
        <StructuredData data={[buildWebsiteSchema(), buildLocalBusinessSchema()]} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
