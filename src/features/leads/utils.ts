import type { Prisma } from "@prisma/client";

import { createLeadNumber } from "@/features/crm/numbering";

export function createLeadNumberSeed() {
  return createLeadNumber();
}

export function isUniqueConstraintError(
  error: unknown,
  target?: string,
): error is Prisma.PrismaClientKnownRequestError {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    error.code !== "P2002"
  ) {
    return false;
  }

  if (!target || !("meta" in error)) {
    return true;
  }

  const meta = error.meta as { target?: string | string[] } | undefined;
  const metaTarget = Array.isArray(meta?.target) ? meta.target : [meta?.target];

  return metaTarget.includes(target);
}

export function formatLeadAssigneeName(assignedTo: {
  firstName: string;
  lastName: string | null;
} | null) {
  if (!assignedTo) {
    return "Unassigned";
  }

  return [assignedTo.firstName, assignedTo.lastName].filter(Boolean).join(" ");
}
