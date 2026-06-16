import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import dynamic from "next/dynamic";

const QuoteForm = dynamic(
  () => import("@/components/website/quote-form").then((m) => m.QuoteForm),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-[20px] overflow-hidden animate-pulse"
        style={{
          background: "rgba(10,22,40,0.92)",
          border: "1px solid rgba(21,101,192,0.25)",
          minHeight: "440px",
        }}
      />
    ),
  }
);

const stats = [
  { num: "500+", label: "Projects Delivered" },
  { num: "15+", label: "Years Experience" },
  { num: "4", label: "Service Verticals" },
  { num: "48hr", label: "AMC Response" },
];
const services = [
  { icon: "💡", title: "Decorative Lighting (ELV)", desc: "Chandelier installations, cove lighting, facade illumination, and bespoke design for homes and commercial spaces.", features: ["Chandelier supply & installation", "LED cove & profile lighting", "Facade & landscape lighting"], href: "/services/decorative-lighting" },
  { icon: "🔒", title: "Security Systems", desc: "CCTV, access control, video door phones, and alarm systems — complete security for homes and offices.", features: ["CCTV & NVR systems", "Biometric access control", "Video door phones"], href: "/services/security-systems" },
  { icon: "⚙️", title: "Smart Automation (AUT)", desc: "Home and office automation — smart switches, scene control, voice integration, and energy management.", features: ["Smart switches & dimmers", "Alexa & Google Home", "Energy monitoring"], href: "/services/smart-automation" },
  { icon: "🔧", title: "AMC Contracts", desc: "Annual Maintenance Contracts with guaranteed response times. Keep systems at peak performance year-round.", features: ["Basic / Standard / Premium tiers", "Emergency callout included", "Spare parts coverage"], href: "/services/amc-services" },
];
const whyUs = [
  { n:"1", title:"End-to-End Ownership", desc:"We design, supply, install and maintain — no handoffs to third parties." },
  { n:"2", title:"Transparent Quotations", desc:"Detailed line-item quotes with zero hidden costs. What you see is what you pay." },
  { n:"3", title:"On-Time Delivery", desc:"We commit to timelines and honour them. Professionally managed projects." },
  { n:"4", title:"Dedicated AMC Support", desc:"Post-sale service backed by SLA guarantees and a dedicated ops team." },
];
const metrics = [
  { num:"500+", label:"Projects Completed" },
  { num:"15+", label:"Years in Business" },
  { num:"98%", label:"Client Satisfaction" },
  { num:"50+", label:"Team Members" },
];
const projects = [
  { tag:"Residential", tag2:null as null|string, emoji:"🏠", grad:"var(--e-proj-a)", title:"Juhu Villa — Full Lighting", desc:"Interior, cove, facade & garden for 5,000 sq ft luxury villa.", loc:"Juhu", year:"2025" },
  { tag:"Commercial", tag2:"Automation", emoji:"🏢", grad:"var(--e-proj-b)", title:"BKC Corporate HQ", desc:"Smart automation, CCTV & lighting for 8,000 sq ft office.", loc:"BKC", year:"2024" },
  { tag:"Hospitality", tag2:null as null|string, emoji:"🏨", grad:"var(--e-proj-c)", title:"Hotel Powai — Lobby", desc:"Bespoke chandelier array and atmospheric lighting.", loc:"Powai", year:"2025" },
  { tag:"Retail", tag2:"Security", emoji:"🛍", grad:"var(--e-proj-d)", title:"Jewellery Showroom", desc:"High-CRI spotlight, CCTV & access control.", loc:"Andheri", year:"2024" },
  { tag:"Residential", tag2:"Smart", emoji:"🏡", grad:"var(--e-proj-e)", title:"Smart Home, Bandra", desc:"Full automation — lighting scenes, climate & security.", loc:"Bandra", year:"2025" },
  { tag:"Industrial", tag2:null as null|string, emoji:"🏭", grad:"var(--e-proj-f)", title:"Factory Campus, Thane", desc:"Industrial LED flood lighting and perimeter security.", loc:"Thane", year:"2024" },
];
const products = [
  { emoji:"🔆", bg:"linear-gradient(135deg,#0A1628,#162842)", cat:"Chandelier", name:"Crystal Pendant XL", price:"₹28,500" },
  { emoji:"💡", bg:"linear-gradient(135deg,#0D1E0A,#162E12)", cat:"LED Strip", name:"Cove Light Pro Kit", price:"₹4,200" },
  { emoji:"📹", bg:"linear-gradient(135deg,#1A0A00,#2A1500)", cat:"Security", name:"4MP IP Camera", price:"₹6,800" },
  { emoji:"🔌", bg:"linear-gradient(135deg,#0A0A1A,#14143A)", cat:"Smart", name:"Touch Switch 6-Gang", price:"₹8,500" },
];
const testimonials = [
  { initials:"RS", name:"Rajesh Shah", loc:"Juhu, Mumbai · Homeowner", svc:"Lighting", svcColor:"blue", quote:"Eros transformed our villa completely. The chandelier they recommended is now the focal point of our living room. Exceptional quality and a very professional team." },
  { initials:"PM", name:"Priya Mehta", loc:"BKC, Mumbai · Facility Manager", svc:"AMC", svcColor:"gold", quote:"We have had their AMC contract for 3 years. Response is always within the promised time and the team is extremely knowledgeable. Complete peace of mind." },
  { initials:"AK", name:"Amit Kulkarni", loc:"Powai, Mumbai · Office Owner", svc:"Security", svcColor:"green", quote:"They installed CCTV and access control across our entire office. The system works flawlessly and the remote monitoring app is excellent." },
];
const brands = ["Philips","Havells","Hikvision","Dahua","Legrand","Schneider","Lutron","Wipro"];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 lg:px-10 py-14 lg:py-20 flex items-center"
               style={{ background: "var(--e-hero-grad)" }}>
        <div className="absolute top-[-80px] right-[-60px] w-[440px] h-[440px] rounded-full pointer-events-none"
             style={{ background:"radial-gradient(circle,rgba(21,101,192,0.09) 0%,transparent 70%)" }} />
        <div className="absolute bottom-[-40px] left-[30%] w-[280px] h-[280px] rounded-full pointer-events-none"
             style={{ background:"radial-gradient(circle,rgba(245,166,35,0.04) 0%,transparent 70%)" }} />
        <div className="max-w-[1100px] mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">

            {/* Left — headline + stats */}
            <div className="lg:pt-6">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] mb-5"
                   style={{ background:"var(--e-gold-dim)", border:"1px solid rgba(245,166,35,0.3)", color:"var(--e-gold)" }}>
                Mumbai&apos;s Premier Lighting &amp; ELV Integrator
              </div>
              <h1 className="font-heading font-extrabold text-[38px] lg:text-[48px] leading-[1.1] mb-4 text-white">
                Lighting that{" "}<em className="not-italic" style={{ color:"var(--e-gold)" }}>Elevates</em><br />Every Space
              </h1>
              <p className="text-[14px] lg:text-[15px] leading-[1.75] max-w-[440px] mb-6" style={{ color:"#8896AA" }}>
                From chandelier installations to smart automation and security — Eros Enterprises designs, supplies, and maintains environments that inspire. Trusted by 500+ clients since 2009.
              </p>

              {/* Quick action buttons */}
              <div className="flex gap-3 flex-wrap mb-8">
                <Link href="/site-visit"
                  className="inline-flex items-center gap-2 bg-[#1565C0] hover:bg-[#1E7FE8] text-white px-5 py-3 rounded-[8px] text-[13px] font-semibold transition-colors">
                  📅 Book Free Site Visit
                </Link>
                <Link href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[8px] text-[13px] font-semibold text-white transition-colors"
                  style={{ border:"1px solid rgba(255,255,255,0.18)" }}>
                  📂 View Projects
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-[10px] px-3 py-3 text-center"
                       style={{ background:"rgba(15,31,61,0.7)", border:"1px solid rgba(21,101,192,0.2)" }}>
                    <div className="font-heading text-[22px] font-extrabold leading-none" style={{ color:"var(--e-gold)" }}>{s.num}</div>
                    <div className="text-[9px] uppercase tracking-[0.05em] mt-1" style={{ color:"#8896AA" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — embedded 3-step QuoteForm */}
            <div className="w-full">
              <QuoteForm sourcePage="/" compact={true} />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background:"var(--e-trust-bg)", borderTop:"1px solid var(--e-trust-bdr)", borderBottom:"1px solid var(--e-trust-bdr)" }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 lg:grid-cols-4">
          {[{ icon:"🛡️", title:"ISO Certified", sub:"Quality Assured" },{ icon:"⏱️", title:"48-Hour SLA", sub:"AMC Guaranteed" },{ icon:"🏗️", title:"500+ Projects", sub:"Across Mumbai" },{ icon:"🎧", title:"24/7 Support", sub:"For AMC Clients" }].map((t, i) => (
            <div key={t.title} className={`flex items-center gap-3 px-5 py-4 ${i<3?"border-r":""} ${i<2?"border-b lg:border-b-0":""}`}
                 style={{ borderColor:"var(--e-divider)" }}>
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[18px] flex-shrink-0"
                   style={{ background:"var(--e-blue-dim)" }}>{t.icon}</div>
              <div>
                <div className="text-[13px] font-bold" style={{ color:"var(--e-text)" }}>{t.title}</div>
                <div className="text-[11px]" style={{ color:"var(--e-muted)" }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="px-6 lg:px-10 py-14">
        <div className="max-w-[1100px] mx-auto">
          <div className="e-eyebrow mb-1.5">What We Do</div>
          <h2 className="font-heading font-extrabold text-[28px] mb-2.5" style={{ color:"var(--e-text)" }}>Our <span style={{ color:"var(--e-gold)" }}>Services</span></h2>
          <p className="text-[14px] max-w-[480px] leading-[1.7] mb-8" style={{ color:"var(--e-muted)" }}>End-to-end solutions across decorative lighting, security, smart automation, and maintenance contracts.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.title} className="relative overflow-hidden group rounded-[14px] p-6 transition-all"
                   style={{ background:"var(--e-card-bg)", border:"1px solid var(--e-card-bdr)" }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px] bg-[#1565C0] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-[46px] h-[46px] rounded-[11px] flex items-center justify-center text-[22px] mb-3.5"
                     style={{ background:"var(--e-blue-dim)", border:"1px solid var(--e-blue-bdr)" }}>{s.icon}</div>
                <h3 className="font-heading font-bold text-[16px] mb-1.5" style={{ color:"var(--e-text)" }}>{s.title}</h3>
                <p className="text-[13px] leading-[1.6] mb-3" style={{ color:"var(--e-muted)" }}>{s.desc}</p>
                <ul className="space-y-1.5 mb-4">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-[12px]" style={{ color:"var(--e-text-sub)" }}>
                      <CheckCircle2 className="w-3 h-3 text-[#25D366] flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="inline-flex items-center gap-1 text-[12px] font-semibold hover:gap-2 transition-all" style={{ color:"var(--e-gold)" }}>
                  Explore service <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US — navy gradient in both modes */}
      <section className="px-6 lg:px-10 py-14" style={{ background:"var(--e-section-navy)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color:"var(--e-blue-lt)" }}>Why Eros</div>
              <h2 className="font-heading font-extrabold text-[28px] mb-2.5 text-white">
                15 Years of <span style={{ color:"var(--e-gold)" }}>Trusted</span> Expertise
              </h2>
              <p className="text-[14px] leading-[1.7] mb-6" style={{ color:"rgba(255,255,255,0.65)" }}>
                Built on quality, transparency, and long-term client relationships.
              </p>
              <div className="space-y-4">
                {whyUs.map((w) => (
                  <div key={w.n} className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 bg-[#1565C0] rounded-[9px] flex items-center justify-center font-heading font-extrabold text-[13px] text-white flex-shrink-0">
                      {w.n}
                    </div>
                    <div>
                      <div className="font-semibold text-[14px] mb-0.5 text-white">{w.title}</div>
                      <div className="text-[12px] leading-[1.6]" style={{ color:"rgba(255,255,255,0.6)" }}>{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-[14px] p-5 text-center"
                     style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)" }}>
                  <div className="font-heading text-[34px] font-extrabold leading-none" style={{ color:"var(--e-gold)" }}>
                    {m.num}
                  </div>
                  <div className="text-[11px] mt-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS — editorial masonry layout */}
      <section className="px-6 lg:px-10 py-14" style={{ background:"var(--e-bg)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="e-eyebrow mb-1.5">Our Work</div>
          <h2 className="font-heading font-extrabold text-[28px] mb-2.5" style={{ color:"var(--e-text)" }}>Featured <span style={{ color:"var(--e-gold)" }}>Projects</span></h2>
          <p className="text-[14px] max-w-[480px] leading-[1.7] mb-7" style={{ color:"var(--e-muted)" }}>Recent installations across Mumbai&apos;s premier residential and commercial spaces.</p>

          {/* Top row: 1 large featured + 2 stacked small */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-3 mb-3">
            {/* Large featured card */}
            <div className="rounded-[16px] overflow-hidden flex flex-col"
                 style={{ background:"var(--e-card-bg)", border:"1px solid var(--e-card-bdr)", boxShadow:"0 4px 20px rgba(21,101,192,0.09)" }}>
              <div className="h-[220px] flex items-center justify-center text-[60px] relative"
                   style={{ background: projects[0].grad }}>
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="tag-gold">{projects[0].tag}</span>
                  {projects[0].tag2 && <span className="tag-blue">{projects[0].tag2}</span>}
                </div>
                {projects[0].emoji}
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color:"var(--e-blue)" }}>Featured Project</div>
                  <h3 className="font-heading font-bold text-[17px] mb-2" style={{ color:"var(--e-text)" }}>{projects[0].title}</h3>
                  <p className="text-[12px] leading-[1.6] mb-3" style={{ color:"var(--e-muted)" }}>{projects[0].desc}</p>
                  <div className="flex gap-3 text-[10px] mb-4" style={{ color:"var(--e-muted2)" }}>
                    <span>📍 {projects[0].loc}</span><span>📅 {projects[0].year}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop:"1px solid var(--e-card-bdr)" }}>
                  {[["48","Pendants"],["12","Zones"],["2 Wks","Duration"]].map(([n,l]) => (
                    <div key={l} className="text-center">
                      <div className="font-heading text-[15px] font-extrabold" style={{ color:"var(--e-blue)" }}>{n}</div>
                      <div className="text-[9px] mt-0.5" style={{ color:"var(--e-muted)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2 stacked small cards */}
            <div className="flex flex-col gap-3">
              {projects.slice(1,3).map((p) => (
                <div key={p.title} className="rounded-[12px] overflow-hidden flex flex-1"
                     style={{ background:"var(--e-card-bg)", border:"1px solid var(--e-card-bdr)", boxShadow:"0 2px 10px rgba(21,101,192,0.07)" }}>
                  <div className="w-[100px] flex-shrink-0 flex items-center justify-center text-[32px] relative"
                       style={{ background: p.grad }}>
                    <div className="absolute top-2 left-2"><span className="tag-gold">{p.tag}</span></div>
                    {p.emoji}
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-heading font-bold text-[13px] mb-1" style={{ color:"var(--e-text)" }}>{p.title}</h3>
                      <p className="text-[11px] leading-[1.5] mb-2" style={{ color:"var(--e-muted)" }}>{p.desc}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 text-[10px]" style={{ color:"var(--e-muted2)" }}>
                        <span>📍 {p.loc}</span><span>📅 {p.year}</span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color:"var(--e-blue)" }}>View →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row: 3 wide horizontal cards */}
          <div className="grid lg:grid-cols-3 gap-3">
            {projects.slice(3).map((p) => (
              <div key={p.title} className="rounded-[12px] overflow-hidden flex"
                   style={{ background:"var(--e-card-bg)", border:"1px solid var(--e-card-bdr)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="w-[90px] flex-shrink-0 flex items-center justify-center text-[28px] relative"
                     style={{ background: p.grad }}>
                  <div className="absolute top-2 left-1.5"><span className="tag-gold" style={{ fontSize:"7px" }}>{p.tag}</span></div>
                  {p.emoji}
                </div>
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <h3 className="font-heading font-bold text-[12px] mb-1" style={{ color:"var(--e-text)" }}>{p.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-[9px]" style={{ color:"var(--e-muted2)" }}>📍 {p.loc} · 📅 {p.year}</div>
                    <span className="text-[9px] font-bold" style={{ color:"var(--e-blue)" }}>View →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-7">
            <Link href="/projects" className="inline-flex items-center gap-2 bg-[#1565C0] hover:bg-[#1E7FE8] text-white px-5 py-3 rounded-[8px] text-[13px] font-semibold transition-colors">
              View All 500+ Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCTS — navy gradient same as dark mode */}
      <section className="px-6 lg:px-10 py-14" style={{ background:"var(--e-section-navy)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color:"rgba(99,153,255,0.7)" }}>Products</div>
          <h2 className="font-heading font-extrabold text-[28px] mb-2.5 text-white">Premium <span style={{ color:"var(--e-gold)" }}>Product Range</span></h2>
          <p className="text-[14px] max-w-[480px] leading-[1.7] mb-8" style={{ color:"rgba(255,255,255,0.5)" }}>Curated lighting, smart controls, and security hardware with professional installation.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {products.map((p) => (
              <div key={p.name} className="rounded-[14px] overflow-hidden"
                   style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}>
                <div className="h-[106px] flex items-center justify-center text-[40px]"
                     style={{ background: p.bg, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{p.emoji}</div>
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.05em] mb-1" style={{ color:"rgba(99,153,255,0.8)" }}>{p.cat}</div>
                  <div className="font-heading font-semibold text-[12px] mb-1.5 text-white">{p.name}</div>
                  <div className="text-[13px] font-bold mb-2" style={{ color:"var(--e-gold)" }}>{p.price}</div>
                  <button className="w-full rounded-[5px] py-1.5 text-[11px] font-semibold transition-colors"
                          style={{ background:"rgba(21,101,192,0.25)", border:"1px solid rgba(21,101,192,0.4)", color:"#93C5FD" }}>
                    Enquire
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-7">
            <Link href="/products"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[8px] text-[13px] font-bold hover:brightness-105 transition-all"
              style={{ background:"var(--e-gold)", color:"#050A14" }}>
              Browse Full Catalogue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 lg:px-10 py-14">
        <div className="max-w-[1100px] mx-auto">
          <div className="e-eyebrow mb-1.5">Testimonials</div>
          <h2 className="font-heading font-extrabold text-[28px] mb-2.5" style={{ color:"var(--e-text)" }}>What Clients <span style={{ color:"var(--e-gold)" }}>Say</span></h2>
          <p className="text-[14px] max-w-[480px] leading-[1.7] mb-8" style={{ color:"var(--e-muted)" }}>Genuine feedback from homeowners, architects, facility managers, and business owners.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {testimonials.map((t) => (
              <div key={t.name} className="relative rounded-[14px] p-5"
                   style={{ background:"var(--e-card-bg)", border:"1px solid var(--e-card-bdr)" }}>
                <div className="text-[30px] leading-none mb-1.5 font-serif" style={{ color:"var(--e-gold)", opacity:0.25 }}>&ldquo;</div>
                <div className="text-[11px] tracking-[2px] mb-2.5" style={{ color:"var(--e-gold)" }}>★★★★★</div>
                <div className="absolute top-3.5 right-3.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px] border"
                        style={{
                          background: t.svcColor==="blue" ? "var(--e-blue-dim)" : t.svcColor==="gold" ? "var(--e-gold-dim)" : "rgba(37,211,102,0.1)",
                          borderColor: t.svcColor==="blue" ? "var(--e-blue-bdr)" : t.svcColor==="gold" ? "rgba(245,166,35,0.3)" : "rgba(37,211,102,0.25)",
                          color: t.svcColor==="blue" ? "var(--e-blue)" : t.svcColor==="gold" ? "var(--e-gold)" : "#25D366",
                        }}>{t.svc}</span>
                </div>
                <p className="text-[12px] leading-[1.7] italic mb-4" style={{ color:"var(--e-text-sub)" }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
                       style={{ background:"var(--e-blue-dim)", border:"1px solid var(--e-blue-bdr)", color:"var(--e-blue)" }}>{t.initials}</div>
                  <div>
                    <div className="text-[12px] font-semibold" style={{ color:"var(--e-text)" }}>{t.name}</div>
                    <div className="text-[10px]" style={{ color:"var(--e-muted)" }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <div className="py-7 px-6 lg:px-10" style={{ background:"var(--e-brands-bg)", borderTop:"1px solid var(--e-divider)", borderBottom:"1px solid var(--e-divider)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-center mb-5" style={{ color:"var(--e-muted)" }}>Trusted Brands We Install &amp; Supply</div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {brands.map((b) => (
            <div key={b} className="rounded-[7px] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.06em]"
                 style={{ background:"var(--e-card-bg)", border:"1px solid var(--e-card-bdr)", color:"var(--e-muted)" }}>{b}</div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 lg:px-10 py-14 text-center"
           style={{ background:"var(--e-cta-grad)", borderTop:"1px solid var(--e-cta-border)", borderBottom:"1px solid var(--e-cta-border)" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-heading font-extrabold text-[28px] lg:text-[32px] text-white mb-2.5">Ready to Transform Your Space?</h2>
          <p className="text-[14px] mb-7" style={{ color:"rgba(255,255,255,0.75)" }}>Talk to our experts. Get a free site visit and customised quote within 24 hours.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-5 py-3 rounded-[8px] text-[13px] font-bold hover:brightness-105 transition-all"
               style={{ background:"var(--e-gold)", color:"#050A14" }}>💬 WhatsApp Us Now</a>
            <a href={`tel:${siteConfig.phone}`}
               className="inline-flex items-center gap-2 px-5 py-3 rounded-[8px] text-[13px] font-semibold text-white transition-colors"
               style={{ border:"1px solid rgba(255,255,255,0.35)" }}>📞 Call {siteConfig.phone}</a>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[8px] text-[13px] font-semibold text-white transition-colors"
              style={{ border:"1px solid rgba(255,255,255,0.35)" }}>📅 Book Site Visit</Link>
          </div>
        </div>
      </div>
    </>
  );
}
