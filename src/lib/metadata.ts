import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: Metadata["keywords"];
  type?: "website" | "article";
};

export const defaultSiteKeywords = [
  "electrical contractor Ahmedabad",
  "decorative lighting Ahmedabad",
  "smart automation Gujarat",
  "commercial electrical services",
  "electrical AMC services",
  "lighting design and execution",
];

export function buildAbsoluteUrl(path = "/") {
  return new URL(path, siteConfig.url);
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
}: MetadataInput): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = buildAbsoluteUrl(path);
  const imageUrl = buildAbsoluteUrl(siteConfig.ogImage);

  return {
    title: fullTitle,
    description,
    applicationName: siteConfig.name,
    keywords: keywords ?? defaultSiteKeywords,
    alternates: {
      canonical: url,
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
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type,
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          alt: siteConfig.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: siteConfig.social.twitter,
      site: siteConfig.social.twitter,
      images: [
        {
          url: imageUrl,
          alt: siteConfig.ogImageAlt,
        },
      ],
    },
  };
}
