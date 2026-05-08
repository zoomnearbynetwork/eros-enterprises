import type {
  ActivityEntityType,
  ActivityType,
  Prisma,
} from "@prisma/client";

type CreateActivityInput = {
  type: ActivityType;
  entityType: ActivityEntityType;
  entityId: string;
  action?: string;
  description: string;
  userId?: string | null;
  leadId?: string | null;
  customerId?: string | null;
  siteVisitId?: string | null;
  serviceId?: string | null;
  quotationId?: string | null;
  invoiceId?: string | null;
  paymentId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function createActivityLog(
  tx: Prisma.TransactionClient,
  input: CreateActivityInput,
) {
  return tx.activityLog.create({
    data: {
      type: input.type,
      action: input.action ?? input.type,
      description: input.description,
      entityType: input.entityType,
      entityId: input.entityId,
      userId: input.userId,
      leadId: input.leadId,
      customerId: input.customerId,
      siteVisitId: input.siteVisitId,
      serviceId: input.serviceId,
      quotationId: input.quotationId,
      invoiceId: input.invoiceId,
      paymentId: input.paymentId,
      metadata: input.metadata,
    },
  });
}
