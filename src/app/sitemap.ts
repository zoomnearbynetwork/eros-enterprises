import type { MetadataRoute } from "next";

import { services } from "@/content/website";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRouteConfig: Array<{
    path: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/services", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/products", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/projects", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/reviews", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/blog", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
  ];
  const staticRoutes = [
    ...staticRouteConfig,
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${siteConfig.url}${service.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
