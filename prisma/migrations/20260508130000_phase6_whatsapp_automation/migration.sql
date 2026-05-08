-- CreateEnum
CREATE TYPE "WhatsAppConversationStatus" AS ENUM ('OPEN', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WhatsAppMessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "WhatsAppMessageStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'RECEIVED');

-- CreateEnum
CREATE TYPE "WhatsAppProvider" AS ENUM ('MOCK', 'META_CLOUD', 'BAILEYS');

-- CreateEnum
CREATE TYPE "AutomationTriggerType" AS ENUM ('LEAD_CREATED', 'SITE_VISIT_SCHEDULED', 'QUOTATION_SENT', 'INVOICE_SENT', 'PAYMENT_DUE', 'AMC_RENEWAL_DUE');

-- CreateEnum
CREATE TYPE "AutomationActionType" AS ENUM ('SEND_WHATSAPP_MESSAGE', 'CREATE_TASK', 'INTERNAL_NOTIFICATION');

-- AlterEnum
ALTER TYPE "ActivityEntityType" ADD VALUE 'WHATSAPP_CONVERSATION';
ALTER TYPE "ActivityEntityType" ADD VALUE 'WHATSAPP_MESSAGE';
ALTER TYPE "ActivityEntityType" ADD VALUE 'AUTOMATION_RULE';

-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'WHATSAPP_MESSAGE_RECEIVED';
ALTER TYPE "ActivityType" ADD VALUE 'WHATSAPP_MESSAGE_SENT';
ALTER TYPE "ActivityType" ADD VALUE 'AUTOMATION_RULE_CREATED';
ALTER TYPE "ActivityType" ADD VALUE 'AUTOMATION_RULE_UPDATED';

-- AlterTable
ALTER TABLE "ActivityLog"
ADD COLUMN "automationRuleId" TEXT,
ADD COLUMN "whatsappConversationId" TEXT,
ADD COLUMN "whatsappMessageId" TEXT;

-- CreateTable
CREATE TABLE "WhatsAppConversation" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "displayName" TEXT,
    "status" "WhatsAppConversationStatus" NOT NULL DEFAULT 'OPEN',
    "provider" "WhatsAppProvider" NOT NULL DEFAULT 'MOCK',
    "providerThreadKey" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "lastDirection" "WhatsAppMessageDirection",
    "lastMessagePreview" TEXT,
    "leadId" TEXT,
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "direction" "WhatsAppMessageDirection" NOT NULL,
    "status" "WhatsAppMessageStatus" NOT NULL DEFAULT 'QUEUED',
    "provider" "WhatsAppProvider" NOT NULL DEFAULT 'MOCK',
    "externalMessageId" TEXT,
    "body" TEXT NOT NULL,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "leadId" TEXT,
    "customerId" TEXT,
    "sentByUserId" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "triggerType" "AutomationTriggerType" NOT NULL,
    "actionType" "AutomationActionType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "messageTemplate" TEXT,
    "taskTitle" TEXT,
    "taskDescription" TEXT,
    "notificationTitle" TEXT,
    "notificationMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppConversation_phone_key" ON "WhatsAppConversation"("phone");

-- CreateIndex
CREATE INDEX "WhatsAppConversation_leadId_idx" ON "WhatsAppConversation"("leadId");

-- CreateIndex
CREATE INDEX "WhatsAppConversation_customerId_idx" ON "WhatsAppConversation"("customerId");

-- CreateIndex
CREATE INDEX "WhatsAppConversation_status_lastMessageAt_idx" ON "WhatsAppConversation"("status", "lastMessageAt");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_conversationId_createdAt_idx" ON "WhatsAppMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_leadId_idx" ON "WhatsAppMessage"("leadId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_customerId_idx" ON "WhatsAppMessage"("customerId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_sentByUserId_idx" ON "WhatsAppMessage"("sentByUserId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_status_direction_idx" ON "WhatsAppMessage"("status", "direction");

-- CreateIndex
CREATE INDEX "AutomationRule_triggerType_isActive_idx" ON "AutomationRule"("triggerType", "isActive");

-- CreateIndex
CREATE INDEX "AutomationRule_actionType_isActive_idx" ON "AutomationRule"("actionType", "isActive");

-- CreateIndex
CREATE INDEX "ActivityLog_whatsappConversationId_idx" ON "ActivityLog"("whatsappConversationId");

-- CreateIndex
CREATE INDEX "ActivityLog_whatsappMessageId_idx" ON "ActivityLog"("whatsappMessageId");

-- CreateIndex
CREATE INDEX "ActivityLog_automationRuleId_idx" ON "ActivityLog"("automationRuleId");

-- AddForeignKey
ALTER TABLE "WhatsAppConversation" ADD CONSTRAINT "WhatsAppConversation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppConversation" ADD CONSTRAINT "WhatsAppConversation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "WhatsAppConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_whatsappConversationId_fkey" FOREIGN KEY ("whatsappConversationId") REFERENCES "WhatsAppConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_whatsappMessageId_fkey" FOREIGN KEY ("whatsappMessageId") REFERENCES "WhatsAppMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_automationRuleId_fkey" FOREIGN KEY ("automationRuleId") REFERENCES "AutomationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
