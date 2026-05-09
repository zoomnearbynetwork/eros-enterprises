import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/structured-data";
import { CtaBanner } from "@/components/website/cta-banner";
import { PageHero } from "@/components/website/page-hero";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { blogPosts, pageMetadata } from "@/content/website";
import { buildMetadata } from "@/lib/metadata";
import { buildBlogCollectionSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMetadata.blog);

export default function BlogPage() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          buildBlogCollectionSchema(blogPosts),
        ]}
      />
      <PageHero
        eyebrow="Blog"
        title="Practical insights on lighting, electrical planning, and long-term performance."
        description="This phase includes an editorial-ready blog index presentation that can later connect to a content system."
      />
      <Section>
        <SectionHeader
          eyebrow="Insights"
          title="Editorial topics positioned for authority, not filler."
          description="The visual tone stays aligned with the rest of the brand while leaving room for future article expansion."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.title}
              id={post.href.split("#")[1]}
              className="rounded-[2rem] border border-white/10 bg-white/4 p-7"
            >
              <div className="text-[11px] font-semibold tracking-[0.24em] text-amber-200 uppercase">
                Insight
              </div>
              <h2 className="mt-4 font-heading text-2xl font-medium text-white">
                {post.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">{post.excerpt}</p>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <CtaBanner
            title="Need applied advice instead of general content?"
            description="Reach out with your actual site or project scope and we can guide the most relevant next step."
          />
        </div>
      </Section>
    </>
  );
}
