-- AlterTable
ALTER TABLE "ProductDimension" ADD COLUMN "description" TEXT;

-- Copy existing product descriptions onto their (single) dimension row
UPDATE "ProductDimension" pd
SET "description" = p."description"
FROM "Product" p
WHERE pd."productId" = p."id" AND p."description" IS NOT NULL;

-- Products with a description but no dimension row yet: create one to hold it
INSERT INTO "ProductDimension" ("id", "dimension", "price", "description", "position", "productId")
SELECT gen_random_uuid()::text, '', NULL, p."description", 0, p."id"
FROM "Product" p
WHERE p."description" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "ProductDimension" pd WHERE pd."productId" = p."id");

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description";
