export const siteConfig = {
  name: "Eros Enterprises",
  legalName: "Eros Enterprises",
  description:
    "Premium electrical contracting, decorative lighting, smart automation, and infrastructure services for residences, commercial spaces, and enterprises.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://erosenterprises.in",
  ogImage: "/og-image.png",
  ogImageAlt:
    "Eros Enterprises premium electrical, lighting, and automation services",
  phone: "+91 98765 43210",
  email: "projects@erosenterprises.in",
  whatsapp: "919876543210",
  address: "Ahmedabad, Gujarat, India",
  locality: "Ahmedabad",
  region: "Gujarat",
  country: "IN",
  serviceArea: ["Ahmedabad", "Gujarat", "India"],
  priceRange: "$$",
  businessType: "LocalBusiness",
  social: {
    twitter: "@erosenterprises",
  },
} as const;
