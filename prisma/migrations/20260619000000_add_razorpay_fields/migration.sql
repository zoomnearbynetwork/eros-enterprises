-- AlterTable: add Razorpay payment link tracking to Invoice
ALTER TABLE "Invoice"
ADD COLUMN IF NOT EXISTS "razorpayPaymentLinkId"  TEXT,
ADD COLUMN IF NOT EXISTS "razorpayPaymentLinkUrl" TEXT;

-- AlterTable: add Razorpay fields + status to Payment
ALTER TABLE "Payment"
ADD COLUMN IF NOT EXISTS "status"               TEXT NOT NULL DEFAULT 'CAPTURED',
ADD COLUMN IF NOT EXISTS "transactionReference" TEXT,
ADD COLUMN IF NOT EXISTS "razorpayPaymentId"    TEXT,
ADD COLUMN IF NOT EXISTS "razorpayOrderId"      TEXT;

-- CreateIndex: enforce uniqueness on razorpayPaymentId (nullable, so NULLs are exempt)
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");
