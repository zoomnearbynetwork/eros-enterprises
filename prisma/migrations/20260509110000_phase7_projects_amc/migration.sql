-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('PLANNED', 'MATERIAL_ORDERED', 'WORK_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AmcStatus" AS ENUM ('ACTIVE', 'DUE_SOON', 'EXPIRED', 'RENEWED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "ActivityEntityType" ADD VALUE 'PROJECT';
ALTER TYPE "ActivityEntityType" ADD VALUE 'AMC_PLAN';

-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'PROJECT_CREATED';
ALTER TYPE "ActivityType" ADD VALUE 'PROJECT_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE 'PROJECT_STAGE_CHANGED';
ALTER TYPE "ActivityType" ADD VALUE 'PROJECT_MANAGER_ASSIGNED';
ALTER TYPE "ActivityType" ADD VALUE 'PROJECT_ENGINEER_ASSIGNED';
ALTER TYPE "ActivityType" ADD VALUE 'PROJECT_PROGRESS_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE 'AMC_PLAN_CREATED';
ALTER TYPE "ActivityType" ADD VALUE 'AMC_PLAN_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE 'AMC_STATUS_CHANGED';
ALTER TYPE "ActivityType" ADD VALUE 'AMC_RENEWAL_RECORDED';

-- AlterTable
ALTER TABLE "ActivityLog"
ADD COLUMN "projectId" TEXT,
ADD COLUMN "amcPlanId" TEXT;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stage" "ProjectStage" NOT NULL DEFAULT 'PLANNED',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "targetCompletionDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "customerId" TEXT NOT NULL,
    "quotationId" TEXT,
    "projectManagerId" TEXT,
    "siteEngineerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmcPlan" (
    "id" TEXT NOT NULL,
    "amcNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "AmcStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "renewalReminderDays" INTEGER[] DEFAULT ARRAY[30, 15, 7]::INTEGER[],
    "lastRenewedAt" TIMESTAMP(3),
    "customerId" TEXT NOT NULL,
    "projectId" TEXT,
    "serviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmcPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectNumber_key" ON "Project"("projectNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Project_quotationId_key" ON "Project"("quotationId");

-- CreateIndex
CREATE INDEX "Project_customerId_idx" ON "Project"("customerId");

-- CreateIndex
CREATE INDEX "Project_quotationId_idx" ON "Project"("quotationId");

-- CreateIndex
CREATE INDEX "Project_projectManagerId_idx" ON "Project"("projectManagerId");

-- CreateIndex
CREATE INDEX "Project_siteEngineerId_idx" ON "Project"("siteEngineerId");

-- CreateIndex
CREATE INDEX "Project_stage_targetCompletionDate_idx" ON "Project"("stage", "targetCompletionDate");

-- CreateIndex
CREATE UNIQUE INDEX "AmcPlan_amcNumber_key" ON "AmcPlan"("amcNumber");

-- CreateIndex
CREATE INDEX "AmcPlan_customerId_idx" ON "AmcPlan"("customerId");

-- CreateIndex
CREATE INDEX "AmcPlan_projectId_idx" ON "AmcPlan"("projectId");

-- CreateIndex
CREATE INDEX "AmcPlan_serviceId_idx" ON "AmcPlan"("serviceId");

-- CreateIndex
CREATE INDEX "AmcPlan_status_renewalDate_idx" ON "AmcPlan"("status", "renewalDate");

-- CreateIndex
CREATE INDEX "AmcPlan_endDate_idx" ON "AmcPlan"("endDate");

-- CreateIndex
CREATE INDEX "ActivityLog_projectId_idx" ON "ActivityLog"("projectId");

-- CreateIndex
CREATE INDEX "ActivityLog_amcPlanId_idx" ON "ActivityLog"("amcPlanId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_siteEngineerId_fkey" FOREIGN KEY ("siteEngineerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmcPlan" ADD CONSTRAINT "AmcPlan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmcPlan" ADD CONSTRAINT "AmcPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmcPlan" ADD CONSTRAINT "AmcPlan_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_amcPlanId_fkey" FOREIGN KEY ("amcPlanId") REFERENCES "AmcPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
