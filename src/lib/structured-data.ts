import type { ServiceDefinition } from "@/content/website";
import { siteConfig } from "@/config/site";
import { buildAbsoluteUrl } from "@/lib/metadata";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type ReviewItem = {
  name: string;
  role: string;
  quote: string;
  rating?: number;
};

type BlogPostItem = {
  title: string;
  excerpt: string;
  href: string;
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path).toString(),
    })),
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
  };
}

export function buildLocalBusinessSchema(reviews: ReviewItem[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    image: buildAbsoluteUrl(siteConfig.ogImage).toString(),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    areaServed: siteConfig.serviceArea,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.locality,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
      streetAddress: siteConfig.address,
    },
    aggregateRating:
      reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: String(reviews.length),
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildServiceSchema(service: ServiceDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.seoDescription,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.legalName,
      url: siteConfig.url,
      telephone: siteConfig.phone,
    },
    areaServed: siteConfig.serviceArea,
    serviceType: service.name,
    category: service.eyebrow,
    url: buildAbsoluteUrl(service.href).toString(),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: buildAbsoluteUrl("/contact").toString(),
    },
  };
}

export function buildReviewSchema(reviews: ReviewItem[]) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    author: {
      "@type": "Person",
      name: review.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(review.rating ?? 5),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: review.quote,
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
    },
    name: `${review.name} review`,
  }));
}

export function buildBlogCollectionSchema(posts: BlogPostItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    description:
      "Practical insights on electrical planning, premium lighting, maintenance, and execution quality.",
    url: buildAbsoluteUrl("/blog").toString(),
    inLanguage: "en-IN",
    blogPost: posts.map((post, index) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: buildAbsoluteUrl(post.href).toString(),
      position: index + 1,
      publisher: {
        "@type": "Organization",
        name: siteConfig.legalName,
        url: siteConfig.url,
      },
    })),
  };
}

export function buildItemListSchema(
  name: string,
  items: Array<{ name: string; path: string; description?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: buildAbsoluteUrl(item.path).toString(),
      name: item.name,
      description: item.description,
    })),
  };
}
