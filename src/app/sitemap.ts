import type { MetadataRoute } from "next";

import { services } from "@/content/website";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{
    path: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
  }> = [
    { path: "/",            changeFrequency: "weekly",  priority: 1.0 },
    { path: "/services",    changeFrequency: "monthly", priority: 0.9 },
    { path: "/products",    changeFrequency: "monthly", priority: 0.8 },
    { path: "/projects",    changeFrequency: "monthly", priority: 0.8 },
    { path: "/about",       changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact",     changeFrequency: "monthly", priority: 0.9 },
    { path: "/get-quote",   changeFrequency: "monthly", priority: 0.9 },
    { path: "/site-visit",  changeFrequency: "monthly", priority: 0.9 },
    { path: "/reviews",     changeFrequency: "weekly",  priority: 0.7 },
    { path: "/blog",        changeFrequency: "weekly",  priority: 0.7 },
    { path: "/faq",         changeFrequency: "monthly", priority: 0.7 },
    { path: "/industries",  changeFrequency: "monthly", priority: 0.6 },
    { path: "/brands",      changeFrequency: "monthly", priority: 0.6 },
    { path: "/resources",   changeFrequency: "monthly", priority: 0.6 },
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
      priority: 0.75,
    })),
  ];
}
