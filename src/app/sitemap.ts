import type { MetadataRoute } from "next";

import { services } from "@/content/website";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/services",
    "/products",
    "/about",
    "/projects",
    "/reviews",
    "/blog",
    "/contact",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
    })),
    ...services.map((service) => ({
      url: `${siteConfig.url}${service.href}`,
      lastModified: new Date(),
    })),
  ];
}
