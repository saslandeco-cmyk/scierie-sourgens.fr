-- CreateTable
CREATE TABLE "CategoryRealisationImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryRealisationImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CategoryRealisationImage" ADD CONSTRAINT "CategoryRealisationImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
