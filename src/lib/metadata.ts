import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: Metadata["keywords"];
};

export function buildMetadata({
  title,
  description,
  path,
  keywords,
}: MetadataInput): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = new URL(path, siteConfig.url);

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
