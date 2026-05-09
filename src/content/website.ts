import type { Metadata } from "next";

export type NavItem = {
  href: string;
  label: string;
};

export type ServiceSlug =
  | "residential-wiring"
  | "decorative-lighting"
  | "smart-automation"
  | "commercial-electrical"
  | "electrical-panels"
  | "cable-systems"
  | "amc-services"
  | "energy-optimization";

export type ServiceDefinition = {
  slug: ServiceSlug;
  href: `/services/${ServiceSlug}`;
  name: string;
  shortName: string;
  eyebrow: string;
  summary: string;
  heroTitle: string;
  heroDescription: string;
  heroStats: Array<{ label: string; value: string }>;
  icon: IconKey;
  painPoints: string[];
  highlights: string[];
  process: string[];
  examples: Array<{
    title: string;
    category: string;
    description: string;
  }>;
  faq: Array<{ question: string; answer: string }>;
  relatedServices: ServiceSlug[];
  seoDescription: string;
};

export type IconKey =
  | "sparkles"
  | "house"
  | "cpu"
  | "building"
  | "panel"
  | "cable"
  | "shield"
  | "leaf"
  | "star"
  | "clock"
  | "badge"
  | "workflow"
  | "quote"
  | "phone";

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const trustIndicators = [
  "Licensed electrical specialists",
  "Decorative lighting execution",
  "Commercial project coordination",
  "AMC and maintenance coverage",
];

export const heroMetrics = [
  { value: "250+", label: "Projects delivered" },
  { value: "98%", label: "Repeat client retention" },
  { value: "24/7", label: "Support for active contracts" },
  { value: "12+", label: "Years in electrical execution" },
];

export const whyChooseEros = [
  {
    title: "Design-led electrical delivery",
    description:
      "We bridge technical infrastructure and visual elegance, so power planning and lighting expression evolve together.",
    icon: "sparkles" as const,
  },
  {
    title: "Enterprise-grade project control",
    description:
      "Clear BOQs, milestone planning, on-site coordination, and disciplined handovers keep quality visible at every stage.",
    icon: "workflow" as const,
  },
  {
    title: "Responsive post-install support",
    description:
      "AMC programs, fault tracing, performance checks, and upgrade readiness protect long-term reliability.",
    icon: "shield" as const,
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Consult & audit",
    description:
      "We understand load, layout, design intent, usage patterns, and operating risks before proposing a solution.",
  },
  {
    step: "02",
    title: "Engineer the scope",
    description:
      "Our team builds the technical approach, lighting strategy, materials plan, and delivery schedule for your site.",
  },
  {
    step: "03",
    title: "Execute with precision",
    description:
      "Installation happens with structured supervision, clean workmanship, and communication your stakeholders can trust.",
  },
  {
    step: "04",
    title: "Commission & support",
    description:
      "Final testing, walkthroughs, and support readiness ensure your system performs long after handover day.",
  },
];

export const featuredProjects = [
  {
    title: "Signature villa lighting overhaul",
    category: "Decorative lighting",
    description:
      "Layered cove, chandelier, facade, and landscape illumination designed to elevate ambience without over-lighting the home.",
  },
  {
    title: "Corporate office power retrofit",
    category: "Commercial electrical",
    description:
      "Panel balancing, cable management, workstation distribution, and lighting refresh for a fast-growing operations floor.",
  },
  {
    title: "Retail showroom automation upgrade",
    category: "Smart automation",
    description:
      "Scene-based lighting and centralized control for smoother daily operations and stronger visual merchandising.",
  },
];

export const testimonialHighlights = [
  {
    name: "Rohan Mehta",
    role: "Director, Meridian Workspace",
    rating: 5,
    quote:
      "Eros brought engineering discipline and premium execution together. The site ran smoothly, and the finished environment feels far more refined than a standard electrical contract.",
  },
  {
    name: "Anika Shah",
    role: "Homeowner",
    rating: 5,
    quote:
      "Their lighting recommendations changed the entire character of our home. The installation was neat, thoughtful, and genuinely high-end.",
  },
  {
    name: "Karan Desai",
    role: "Facilities Lead, Nova Retail",
    rating: 5,
    quote:
      "Fast response, clear communication, and a team that understood both uptime and aesthetics. That combination is rare.",
  },
];

export const homeFaq = [
  {
    question: "Do you handle both electrical infrastructure and decorative lighting?",
    answer:
      "Yes. Eros Enterprises is positioned to deliver core electrical works, panel and cable systems, and higher-end decorative or architectural lighting with one coordinated team.",
  },
  {
    question: "Can you support commercial maintenance after project handover?",
    answer:
      "Yes. We provide AMC and preventive maintenance support for facilities that need reliable follow-up, response planning, and periodic system reviews.",
  },
  {
    question: "Do you work with architects and interior designers?",
    answer:
      "Yes. We regularly align with architects, interior teams, and project managers to protect both design intent and execution quality.",
  },
  {
    question: "Is the website form connected to backend systems already?",
    answer:
      "Yes. Website submissions flow into the CRM lead database with source tracking, activity logging, and status-ready records for the sales team.",
  },
];

export const productCategories = [
  {
    title: "Architectural luminaires",
    description:
      "Refined indoor and facade fixtures selected for hospitality, residential, retail, and executive office environments.",
  },
  {
    title: "Switchgear and controls",
    description:
      "Reliable control hardware, panel accessories, and operating components aligned with long-term system performance.",
  },
  {
    title: "Cable and conduit systems",
    description:
      "Structured routing materials and protection systems suited for clean, safe, large-scale installations.",
  },
  {
    title: "Smart control ecosystems",
    description:
      "Automation-ready dimming, scene programming, scheduling, and integrated control interfaces for modern properties.",
  },
];

export const projectStats = [
  { value: "Luxury Homes", label: "Ambient lighting and wiring upgrades" },
  { value: "Offices", label: "Panel, workstation, and utility systems" },
  { value: "Retail", label: "Display-oriented lighting execution" },
  { value: "Facilities", label: "AMC-driven uptime and maintenance" },
];

export const reviewStats = [
  { value: "4.9/5", label: "Average satisfaction signal" },
  { value: "90%+", label: "Clients from referrals or repeats" },
  { value: "< 2 hrs", label: "Typical response on active accounts" },
];

export const blogPosts = [
  {
    title: "How premium lighting changes the perceived value of a space",
    excerpt:
      "A practical look at layering, warmth, control, and finish quality in high-end environments.",
    href: "/blog#premium-lighting-value",
  },
  {
    title: "Electrical planning mistakes that increase retrofit costs",
    excerpt:
      "Common coordination gaps that create avoidable expense during residential and commercial execution.",
    href: "/blog#electrical-planning-mistakes",
  },
  {
    title: "What to include in an electrical AMC for business continuity",
    excerpt:
      "The operating checks, escalation rules, and preventive routines that matter most in ongoing support contracts.",
    href: "/blog#electrical-amc-business-continuity",
  },
];

export const services: ServiceDefinition[] = [
  {
    slug: "residential-wiring",
    href: "/services/residential-wiring",
    name: "Residential Wiring",
    shortName: "Residential Wiring",
    eyebrow: "Residential systems",
    summary:
      "Safe, clean, future-ready electrical wiring for villas, apartments, and premium home renovations.",
    heroTitle: "Residential wiring engineered for comfort, safety, and future expansion.",
    heroDescription:
      "From fresh construction to upgrades, we create organized residential electrical systems that support modern living without compromising finish quality.",
    heroStats: [
      { label: "Typical scope", value: "New builds & retrofits" },
      { label: "Focus", value: "Safety + clean routing" },
    ],
    icon: "house",
    painPoints: [
      "Messy circuits and overloaded points create long-term reliability risks.",
      "Poor planning leads to visible rework and compromised interiors.",
      "Homes outgrow old electrical layouts once automation and premium lighting are added.",
    ],
    highlights: [
      "Load-aware circuit planning and distribution",
      "Concealed wiring with finish-sensitive execution",
      "Provisioning for automation, lighting scenes, and future upgrades",
      "Testing, labeling, and handover clarity for homeowners",
    ],
    process: [
      "Site review and living-pattern assessment",
      "Circuit planning with fixture and appliance coordination",
      "Structured installation with neat routing and protection",
      "Final testing, walkthrough, and expansion recommendations",
    ],
    examples: [
      {
        title: "Luxury duplex rewiring",
        category: "Home renovation",
        description:
          "Modernized a multi-floor residence with revised load zones, concealed routes, and new decorative lighting provisions.",
      },
      {
        title: "New villa electrical planning",
        category: "Ground-up build",
        description:
          "Designed a future-ready home electrical framework with dedicated automation pathways and premium finish coordination.",
      },
    ],
    faq: [
      {
        question: "Can you coordinate wiring with interior design plans?",
        answer:
          "Yes. We work alongside interior and architectural teams to align electrical points, lighting layouts, and finish-sensitive execution.",
      },
      {
        question: "Do you support partial home rewiring projects?",
        answer:
          "Yes. We handle full and partial rewiring depending on the age of the system, the renovation scope, and safety priorities.",
      },
    ],
    relatedServices: ["decorative-lighting", "smart-automation", "electrical-panels"],
    seoDescription:
      "Premium residential wiring services for new homes and renovations, including circuit planning, concealed wiring, and future-ready provisions.",
  },
  {
    slug: "decorative-lighting",
    href: "/services/decorative-lighting",
    name: "Decorative Lighting",
    shortName: "Decorative Lighting",
    eyebrow: "Lighting design",
    summary:
      "Elegant indoor, facade, and feature lighting that elevates visual character while respecting technical performance.",
    heroTitle: "Decorative lighting that turns technical planning into atmosphere.",
    heroDescription:
      "We deliver premium decorative and architectural lighting systems for residences, retail environments, hospitality spaces, and executive interiors.",
    heroStats: [
      { label: "Applications", value: "Interior + facade" },
      { label: "Approach", value: "Aesthetic + engineered" },
    ],
    icon: "sparkles",
    painPoints: [
      "Spaces feel expensive on paper but flat in reality when lighting is generic.",
      "Fixtures are often chosen without considering beam, glare, dimming, or maintenance.",
      "Design intent gets lost when lighting is separated from electrical execution.",
    ],
    highlights: [
      "Ambient, accent, feature, and facade lighting strategies",
      "Fixture planning with dimming and control compatibility",
      "Luxury residential and branded commercial visual language",
      "Detail-driven execution that protects material finishes",
    ],
    process: [
      "Mood and usage discovery",
      "Fixture and placement recommendations",
      "Control and power coordination",
      "Installation supervision and nighttime tuning",
    ],
    examples: [
      {
        title: "Boutique showroom lighting refresh",
        category: "Retail",
        description:
          "Introduced layered lighting zones to improve product presentation, circulation comfort, and brand perception.",
      },
      {
        title: "Premium home ambience package",
        category: "Residential",
        description:
          "Balanced cove, pendant, niche, staircase, and landscape lighting to create a cohesive luxury feel across the property.",
      },
    ],
    faq: [
      {
        question: "Do you help select fixtures as well as install them?",
        answer:
          "Yes. We can guide fixture type, placement, and compatibility so the final result works visually and technically.",
      },
      {
        question: "Can decorative lighting be integrated with automation scenes?",
        answer:
          "Yes. We frequently coordinate lighting layers with dimming, scheduling, and scene controls for a more premium experience.",
      },
    ],
    relatedServices: ["smart-automation", "residential-wiring", "energy-optimization"],
    seoDescription:
      "Decorative and architectural lighting services for luxury homes, retail spaces, and commercial interiors with premium execution.",
  },
  {
    slug: "smart-automation",
    href: "/services/smart-automation",
    name: "Smart Automation",
    shortName: "Smart Automation",
    eyebrow: "Intelligent control",
    summary:
      "Scene-based control, scheduling, and integrated automation for homes, offices, and experiential spaces.",
    heroTitle: "Smart automation that feels seamless to use and disciplined to maintain.",
    heroDescription:
      "We design practical automation layers around the way your property actually operates, with special focus on lighting, comfort, and centralized control.",
    heroStats: [
      { label: "Controls", value: "Scenes, schedules, access" },
      { label: "Best for", value: "Homes + business spaces" },
    ],
    icon: "cpu",
    painPoints: [
      "Fragmented controls create confusion instead of convenience.",
      "Automation retrofits fail when electrical planning is not aligned from the start.",
      "Owners want premium control without a system that is difficult to maintain.",
    ],
    highlights: [
      "Scene programming for lighting and occupancy patterns",
      "Centralized control for convenience and consistency",
      "Scalable architecture for future device expansion",
      "Onboarding and support for long-term usability",
    ],
    process: [
      "Use-case mapping and system planning",
      "Electrical and control integration design",
      "Installation, programming, and testing",
      "Client training and post-go-live support",
    ],
    examples: [
      {
        title: "Boardroom and office scheduling controls",
        category: "Commercial",
        description:
          "Automated lighting scenes and operational timing for predictable daily readiness.",
      },
      {
        title: "Smart villa lighting scenes",
        category: "Residential",
        description:
          "Created mood-driven scenes for hosting, evening comfort, circulation, and security lighting.",
      },
    ],
    faq: [
      {
        question: "Can automation be added to an existing property?",
        answer:
          "Yes. We assess current infrastructure and recommend the cleanest upgrade path based on available wiring, control goals, and finish constraints.",
      },
      {
        question: "Do you only automate lighting?",
        answer:
          "Lighting is a core focus, but the planning can also account for broader property control requirements where relevant.",
      },
    ],
    relatedServices: ["decorative-lighting", "residential-wiring", "commercial-electrical"],
    seoDescription:
      "Smart automation services for lighting scenes, centralized control, and practical property-wide automation planning.",
  },
  {
    slug: "commercial-electrical",
    href: "/services/commercial-electrical",
    name: "Commercial Electrical",
    shortName: "Commercial Electrical",
    eyebrow: "Business infrastructure",
    summary:
      "Electrical systems for offices, retail, hospitality, and facilities that require uptime, structure, and clean execution.",
    heroTitle: "Commercial electrical delivery with enterprise discipline.",
    heroDescription:
      "We support businesses with fit-out electrical works, distribution planning, renovation upgrades, and ongoing facility enhancements.",
    heroStats: [
      { label: "Environments", value: "Office, retail, hospitality" },
      { label: "Priority", value: "Uptime + coordinated execution" },
    ],
    icon: "building",
    painPoints: [
      "Commercial sites need structured coordination across vendors and timelines.",
      "Operational downtime makes electrical mistakes far more expensive.",
      "Generic execution often ignores future scale, occupancy patterns, and serviceability.",
    ],
    highlights: [
      "Fit-out and expansion support for active businesses",
      "Workstation, utility, and lighting distribution planning",
      "Clear coordination with PMs, architects, and site teams",
      "Reliable documentation and post-install support",
    ],
    process: [
      "Requirement mapping with stakeholders",
      "Site engineering and scheduling",
      "Phased execution aligned to site operations",
      "Testing, snag closure, and structured handover",
    ],
    examples: [
      {
        title: "Workspace expansion package",
        category: "Office",
        description:
          "Upgraded workstation, lighting, and back-end power distribution during a staged occupancy transition.",
      },
      {
        title: "Retail fit-out electrical execution",
        category: "Retail",
        description:
          "Coordinated customer-facing lighting, service loads, and control points to support launch deadlines.",
      },
    ],
    faq: [
      {
        question: "Can you work in active commercial spaces?",
        answer:
          "Yes. We plan phased work carefully to reduce disruption and maintain operational continuity where possible.",
      },
      {
        question: "Do you support multi-vendor coordination?",
        answer:
          "Yes. We regularly coordinate with civil, HVAC, interiors, and operations stakeholders during project delivery.",
      },
    ],
    relatedServices: ["electrical-panels", "cable-systems", "amc-services"],
    seoDescription:
      "Commercial electrical services for offices, retail, hospitality, and business facilities with structured execution and support.",
  },
  {
    slug: "electrical-panels",
    href: "/services/electrical-panels",
    name: "Electrical Panels",
    shortName: "Electrical Panels",
    eyebrow: "Power distribution",
    summary:
      "Panel planning, upgrades, and organization for safer, more manageable electrical distribution.",
    heroTitle: "Electrical panels planned for protection, clarity, and long-term serviceability.",
    heroDescription:
      "We deliver panel-related work with close attention to load structure, accessibility, labeling, and ongoing maintenance confidence.",
    heroStats: [
      { label: "Core outcomes", value: "Protection + clarity" },
      { label: "Use cases", value: "New and upgrade works" },
    ],
    icon: "panel",
    painPoints: [
      "Poorly organized panels become harder to troubleshoot and expand.",
      "Distribution issues increase safety risk and operational uncertainty.",
      "Businesses and homes alike need panels that are understandable after handover.",
    ],
    highlights: [
      "Load review and distribution refinement",
      "Upgrade and replacement planning",
      "Improved accessibility, naming, and documentation",
      "Support for linked cable and control systems",
    ],
    process: [
      "Audit of current distribution setup",
      "Protection and layout planning",
      "Installation or upgrade execution",
      "Testing, labeling, and maintenance guidance",
    ],
    examples: [
      {
        title: "Office panel balancing update",
        category: "Commercial",
        description:
          "Reworked panel organization and labeling to improve load understanding and future maintenance speed.",
      },
      {
        title: "Residential panel modernization",
        category: "Residential",
        description:
          "Upgraded outdated home distribution with safer segmentation and cleaner long-term usability.",
      },
    ],
    faq: [
      {
        question: "Can you assess whether an existing panel needs upgrading?",
        answer:
          "Yes. We review age, load requirements, operational issues, and future needs to recommend whether improvement or replacement makes more sense.",
      },
      {
        question: "Do you document circuits after the panel work?",
        answer:
          "Yes. Clear labeling and handover visibility are part of making the system easier to operate and maintain.",
      },
    ],
    relatedServices: ["commercial-electrical", "cable-systems", "amc-services"],
    seoDescription:
      "Electrical panel services including load planning, upgrades, replacement support, and organized distribution systems.",
  },
  {
    slug: "cable-systems",
    href: "/services/cable-systems",
    name: "Cable Systems",
    shortName: "Cable Systems",
    eyebrow: "Structured routing",
    summary:
      "Organized cable routes and support systems that keep sites safe, scalable, and visually controlled.",
    heroTitle: "Cable systems that support performance without visual chaos.",
    heroDescription:
      "We implement cable and conduit planning with clean routing logic, future maintenance visibility, and coordination across demanding project environments.",
    heroStats: [
      { label: "Focus", value: "Clean routing + safety" },
      { label: "Best for", value: "Commercial and infrastructure-heavy sites" },
    ],
    icon: "cable",
    painPoints: [
      "Cable clutter makes fault tracing and future upgrades harder.",
      "Poor routing standards can affect safety, access, and finish quality.",
      "Infrastructure-heavy spaces need cable planning that anticipates change.",
    ],
    highlights: [
      "Cable tray, conduit, and route planning",
      "Execution aligned with maintenance access",
      "Support for high-density commercial environments",
      "Improved system order and expansion readiness",
    ],
    process: [
      "Layout and route study",
      "Cable path planning with site coordination",
      "Installation with protection and neatness controls",
      "Validation and handover visibility",
    ],
    examples: [
      {
        title: "Retail back-of-house cable restructuring",
        category: "Operations support",
        description:
          "Reorganized service routes to reduce clutter and simplify future maintenance work.",
      },
      {
        title: "Commercial fit-out cable network",
        category: "Office fit-out",
        description:
          "Created coordinated electrical routing paths that stayed clean through a multi-vendor interior execution.",
      },
    ],
    faq: [
      {
        question: "Is cable planning only relevant for large commercial sites?",
        answer:
          "It matters most in complex spaces, but even smaller sites benefit from organized routes that reduce visual clutter and make future work easier.",
      },
      {
        question: "Can you improve an already installed cable layout?",
        answer:
          "Yes. We can assess and reorganize existing cable systems where operational or maintenance concerns justify it.",
      },
    ],
    relatedServices: ["commercial-electrical", "electrical-panels", "energy-optimization"],
    seoDescription:
      "Cable system planning and execution for clean routing, scalable infrastructure, and easier maintenance across commercial sites.",
  },
  {
    slug: "amc-services",
    href: "/services/amc-services",
    name: "AMC Services",
    shortName: "AMC Services",
    eyebrow: "Maintenance coverage",
    summary:
      "Annual maintenance and preventive support for properties that cannot afford reactive electrical operations.",
    heroTitle: "AMC services built around reliability, prevention, and faster recovery.",
    heroDescription:
      "Our maintenance programs are designed to reduce disruption, surface issues early, and keep electrical systems performing across residential societies, offices, and facilities.",
    heroStats: [
      { label: "Model", value: "Preventive + responsive" },
      { label: "Best fit", value: "Facilities and active properties" },
    ],
    icon: "shield",
    painPoints: [
      "Reactive maintenance leads to longer outages and unplanned cost.",
      "Facility teams need dependable partners, not one-off fixes.",
      "Many sites lack a structured cadence for inspection and preventive review.",
    ],
    highlights: [
      "Preventive inspections and system health checks",
      "Priority support for enrolled accounts",
      "Issue logging and escalation visibility",
      "Maintenance planning aligned with business continuity",
    ],
    process: [
      "Site baseline review",
      "AMC scope definition and response planning",
      "Scheduled visits and preventive actions",
      "Incident support and periodic reporting",
    ],
    examples: [
      {
        title: "Office facility AMC",
        category: "Commercial support",
        description:
          "Established recurring panel, lighting, and electrical health checks for a growing operations workspace.",
      },
      {
        title: "Retail maintenance partnership",
        category: "Multi-site support",
        description:
          "Created a response-oriented maintenance routine to improve uptime across active business hours.",
      },
    ],
    faq: [
      {
        question: "What does an AMC typically include?",
        answer:
          "The exact scope varies, but it generally includes preventive inspections, performance checks, prioritized support, and a defined response structure.",
      },
      {
        question: "Do you offer AMC for systems you did not originally install?",
        answer:
          "Yes, after an initial assessment. We need a baseline understanding of the site before defining the most responsible support model.",
      },
    ],
    relatedServices: ["commercial-electrical", "electrical-panels", "energy-optimization"],
    seoDescription:
      "AMC electrical maintenance services for offices, retail, and facilities focused on preventive care and faster issue response.",
  },
  {
    slug: "energy-optimization",
    href: "/services/energy-optimization",
    name: "Energy Optimization",
    shortName: "Energy Optimization",
    eyebrow: "Efficiency strategy",
    summary:
      "Electrical and lighting improvements that reduce waste, improve control, and support smarter operating costs.",
    heroTitle: "Energy optimization that improves efficiency without sacrificing experience.",
    heroDescription:
      "We identify lighting, control, and electrical opportunities that make properties more efficient while preserving comfort, usability, and brand presentation.",
    heroStats: [
      { label: "Levers", value: "Lighting + controls + usage" },
      { label: "Outcome", value: "Lower waste, better visibility" },
    ],
    icon: "leaf",
    painPoints: [
      "Energy costs climb when systems are not reviewed as usage changes.",
      "Spaces often stay over-lit or poorly controlled throughout the day.",
      "Efficiency upgrades fail when they ignore user experience and site realities.",
    ],
    highlights: [
      "Usage-aware lighting and control recommendations",
      "Operational efficiency improvements without harsh compromises",
      "Retrofit thinking for existing homes and commercial spaces",
      "Alignment with maintenance and future automation plans",
    ],
    process: [
      "Audit of current usage and system behavior",
      "Opportunity mapping and recommendation planning",
      "Targeted implementation of approved upgrades",
      "Performance review and next-step guidance",
    ],
    examples: [
      {
        title: "Retail lighting efficiency tune-up",
        category: "Retail",
        description:
          "Reduced unnecessary output and improved control timing while preserving a premium showroom feel.",
      },
      {
        title: "Office usage optimization review",
        category: "Commercial",
        description:
          "Recommended smarter control schedules and lighting adjustments to better match real occupancy patterns.",
      },
    ],
    faq: [
      {
        question: "Is energy optimization only about reducing fixture count?",
        answer:
          "No. It is about achieving the right light levels, controls, and electrical behavior for the way a property actually operates.",
      },
      {
        question: "Can you combine efficiency upgrades with decorative lighting goals?",
        answer:
          "Yes. We aim for efficient performance that still protects ambience, brand character, and user comfort.",
      },
    ],
    relatedServices: ["decorative-lighting", "smart-automation", "amc-services"],
    seoDescription:
      "Energy optimization services for lighting and electrical systems focused on efficiency, control, and better operating performance.",
  },
];

export const servicesBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service])
) as Record<ServiceSlug, ServiceDefinition>;

export const serviceCategories = services.map((service) => ({
  href: service.href,
  name: service.name,
  summary: service.summary,
  icon: service.icon,
}));

export const contactFaq = [
  {
    question: "How quickly can Eros respond to a new enquiry?",
    answer:
      "Initial website enquiries can typically be reviewed quickly, and active projects or maintenance accounts receive prioritized response handling.",
  },
  {
    question: "Do you offer site visits before quoting?",
    answer:
      "Yes. Site visits are often the best starting point for larger residential, commercial, lighting, or maintenance scopes.",
  },
];

export const pageMetadata: Record<
  string,
  { title: string; description: string; path: string; keywords?: Metadata["keywords"] }
> = {
  home: {
    title: "Premium Electrical and Lighting Solutions",
    description:
      "Eros Enterprises delivers premium electrical contracting, decorative lighting, smart automation, AMC services, and commercial execution.",
    path: "/",
    keywords: [
      "electrical contractor",
      "decorative lighting",
      "smart automation",
      "commercial electrical",
      "premium lighting company",
    ],
  },
  services: {
    title: "Electrical and Lighting Services",
    description:
      "Explore residential wiring, decorative lighting, automation, panel systems, cable systems, AMC support, and energy optimization services.",
    path: "/services",
  },
  products: {
    title: "Lighting and Electrical Product Focus",
    description:
      "Discover the lighting, control, switchgear, and cable categories that support Eros Enterprises project delivery.",
    path: "/products",
  },
  about: {
    title: "About Eros Enterprises",
    description:
      "Learn how Eros Enterprises combines electrical execution, lighting sophistication, and enterprise-grade project control.",
    path: "/about",
  },
  projects: {
    title: "Selected Electrical and Lighting Projects",
    description:
      "View selected residential, retail, and commercial execution highlights from Eros Enterprises.",
    path: "/projects",
  },
  reviews: {
    title: "Client Reviews and Testimonials",
    description:
      "Read what homeowners, facility leaders, and business operators say about working with Eros Enterprises.",
    path: "/reviews",
  },
  blog: {
    title: "Insights on Electrical, Lighting, and Maintenance",
    description:
      "Read practical articles on premium lighting, electrical planning, maintenance strategy, and project execution.",
    path: "/blog",
  },
  contact: {
    title: "Contact Eros Enterprises",
    description:
      "Request a quote, site visit, or project consultation with Eros Enterprises.",
    path: "/contact",
  },
};
