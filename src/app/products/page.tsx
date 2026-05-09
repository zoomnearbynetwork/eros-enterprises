import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/structured-data";
import { CtaBanner } from "@/components/website/cta-banner";
import { PageHero } from "@/components/website/page-hero";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { StatBlock } from "@/components/website/stat-block";
import { productCategories, pageMetadata, projectStats } from "@/content/website";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMetadata.products);

export default function ProductsPage() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          buildItemListSchema(
            "Lighting and electrical product categories",
            productCategories.map((category) => ({
              name: category.title,
              path: "/products",
              description: category.description,
            })),
          ),
        ]}
      />
      <PageHero
        eyebrow="Products"
        title="Product categories selected to support refined, reliable execution."
        description="Eros Enterprises combines project delivery with strong product judgment across lighting, control, cable, and electrical support categories."
      />
      <Section>
        <SectionHeader
          eyebrow="Product focus"
          title="Categories that shape premium electrical and lighting outcomes."
          description="This page positions the product ecosystem behind our projects without turning the website into a generic catalogue."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {productCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-[2rem] border border-white/10 bg-white/4 p-7"
            >
              <h3 className="font-heading text-2xl font-medium text-white">
                {category.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                {category.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projectStats.map((stat) => (
            <StatBlock key={stat.value} value={stat.value} label={stat.label} />
          ))}
        </div>
        <div className="mt-12">
          <CtaBanner
            title="Need a product-led conversation for an upcoming project?"
            description="We can help align fixtures, controls, and infrastructure decisions with the outcome you want on-site."
          />
        </div>
      </Section>
    </>
  );
}
