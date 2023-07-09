CREATE SEQUENCE IF NOT EXISTS bills_rootfi_id_seq;

DROP TYPE IF EXISTS "public"."IntegrationType";
CREATE TYPE "public"."IntegrationType" AS ENUM ('ZOHO_BOOKS', 'QUICKBOOKS_SANDBOX', 'QUICKBOOKS', 'XERO', 'TALLY', 'SAGE_CLOUD_ACCOUNTING', 'MS_DYNAMICS_365', 'SAGE_ZA_CLOUD_ACCOUNTING', 'MYOB_BUSINESS', 'WAVE', 'ODOO_ACCOUNTING', 'AMAZON', 'SHOPIFY', 'FLIPKART', 'NETSUITE');
DROP TYPE IF EXISTS "public"."ArtifactStatus";
CREATE TYPE "public"."ArtifactStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID', 'UNKNOWN');

-- Table Definition
CREATE TABLE "public"."bills" (
    "rootfi_id" int4 NOT NULL DEFAULT nextval('bills_rootfi_id_seq'::regclass),
    "rootfi_created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rootfi_updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rootfi_integration_type" "public"."IntegrationType" NOT NULL,
    "raw_data" jsonb,
    "platform_id" text NOT NULL,
    "document_number" text,
    "posted_date" timestamp(3),
    "due_date" timestamp(3),
    "currency" text,
    "total_amount" float8,
    "tax_amount" float8,
    "amount_due" float8,
    "updated_at" timestamp(3),
    "status" "public"."ArtifactStatus",
    "currency_rate" float8,
    "data_hash" text,
    "purchase_order_ids" jsonb,
    "sub_total" float8,
    "total_discount" float8,
    "contact_id" text,
    "memo" text,
    "line_items" jsonb,
    PRIMARY KEY ("rootfi_id")
);



