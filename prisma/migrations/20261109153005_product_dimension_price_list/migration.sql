-- CreateTable
CREATE TABLE "ProductDimension" (
    "id" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "position" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductDimension_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductDimension" ADD CONSTRAINT "ProductDimension_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing dimensions/price into ProductDimension rows
INSERT INTO "ProductDimension" ("id", "dimension", "price", "position", "productId")
SELECT gen_random_uuid()::text, COALESCE("dimensions", ''), "price", 0, "id"
FROM "Product"
WHERE "dimensions" IS NOT NULL OR "price" IS NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "dimensions",
DROP COLUMN "price";
