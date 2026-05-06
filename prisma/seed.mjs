import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the Prisma seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const roles = [
  {
    name: "SUPER_ADMIN",
    description: "Full platform access, tenant setup, and production controls.",
  },
  {
    name: "SALES_MANAGER",
    description: "Owns lead pipelines, assignments, and sales reporting.",
  },
  {
    name: "OPERATIONS_MANAGER",
    description: "Coordinates delivery, site visits, and post-sale workflows.",
  },
  {
    name: "ACCOUNTS_EXECUTIVE",
    description: "Handles quotations, invoices, payment follow-up, and ledgers.",
  },
];

const services = [
  {
    code: "ELV",
    name: "ELV Systems",
    description: "Structured cabling, CCTV, access control, and safety systems.",
  },
  {
    code: "AMC",
    name: "AMC Contracts",
    description: "Annual maintenance contracts and preventive service plans.",
  },
  {
    code: "AUT",
    name: "Workflow Automation",
    description: "Operational automations spanning lead capture to invoicing.",
  },
];

async function main() {
  await prisma.$transaction([
    ...roles.map((role) =>
      prisma.role.upsert({
        where: { name: role.name },
        update: role,
        create: role,
      }),
    ),
    ...services.map((service) =>
      prisma.service.upsert({
        where: { code: service.code },
        update: service,
        create: service,
      }),
    ),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
