import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getFlatCategoryOptions } from "@/lib/catalog";
import { updateProduct } from "../../actions";
import ProductForm from "../../ProductForm";
import s from "../../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: true,
      images: { orderBy: { position: "asc" } },
      dimensions: { orderBy: { position: "asc" } },
    },
  });
  if (!product) {
    notFound();
  }

  const categories = await getFlatCategoryOptions();

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Modifier « {product.name} »</h1>
      </div>
      <ProductForm
        action={updateProduct.bind(null, id)}
        categories={categories}
        defaults={{
          name: product.name,
          longDescription: product.longDescription,
          dimensions: product.dimensions.map((d) => ({ dimension: d.dimension, price: d.price, description: d.description })),
          priceUnit: product.priceUnit,
          priceUnitSuffix: product.priceUnitSuffix,
          priceStatus: product.priceStatus,
          categoryIds: product.categories.map((c) => c.id),
          position: product.position,
          images: product.images.map((img) => ({ id: img.id, url: img.url })),
        }}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
