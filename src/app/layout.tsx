import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/structured-data";
import { SiteShell } from "@/components/website/site-shell";
import { ThemeProvider } from "@/components/website/theme-provider";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";
import { buildLocalBusinessSchema, buildWebsiteSchema } from "@/lib/structured-data";

import "./globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Premium Electrical and Lighting Solutions",
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
    <html lang="en" className="h-full dark antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <StructuredData data={[buildWebsiteSchema(), buildLocalBusinessSchema()]} />
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
