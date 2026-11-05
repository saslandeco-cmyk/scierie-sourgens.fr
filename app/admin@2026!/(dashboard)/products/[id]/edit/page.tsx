import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getFlatCategoryOptions } from "@/lib/catalog";
import { updateProduct } from "../../actions";
import ProductForm from "../../ProductForm";
import s from "../../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
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
          description: product.description ?? "",
          categoryId: product.categoryId,
          position: product.position,
          imageUrl: product.imageUrl,
        }}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
