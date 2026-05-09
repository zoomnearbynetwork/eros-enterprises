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

const users = [
  {
    email: "admin@erosenterprises.in",
    firstName: "Aarav",
    lastName: "Menon",
    phone: "+91 98765 40001",
    roleName: "SUPER_ADMIN",
  },
  {
    email: "sales@erosenterprises.in",
    firstName: "Diya",
    lastName: "Shah",
    phone: "+91 98765 40002",
    roleName: "SALES_MANAGER",
  },
  {
    email: "ops@erosenterprises.in",
    firstName: "Rohan",
    lastName: "Kapoor",
    phone: "+91 98765 40003",
    roleName: "OPERATIONS_MANAGER",
  },
  {
    email: "accounts@erosenterprises.in",
    firstName: "Meera",
    lastName: "Desai",
    phone: "+91 98765 40004",
    roleName: "ACCOUNTS_EXECUTIVE",
  },
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role,
    });
  }

  for (const service of services) {
    await prisma.service.upsert({
      where: { code: service.code },
      update: service,
      create: service,
    });
  }

  for (const user of users) {
    const role = await prisma.role.findUnique({
      where: { name: user.roleName },
      select: { id: true },
    });

    if (!role) {
      throw new Error(`Role ${user.roleName} is required before seeding users.`);
    }

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        roleId: role.id,
      },
      create: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        roleId: role.id,
      },
    });
  }
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
