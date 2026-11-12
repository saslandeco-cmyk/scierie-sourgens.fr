-- AlterTable
ALTER TABLE "Product" DROP COLUMN "priceUnitSuffix";

-- AlterTable
ALTER TABLE "ProductDimension" ADD COLUMN     "priceUnitSuffix" TEXT;
