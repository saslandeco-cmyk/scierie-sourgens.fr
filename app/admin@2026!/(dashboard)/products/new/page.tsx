import { getFlatCategoryOptions } from "@/lib/catalog";
import { createProduct } from "../actions";
import ProductForm from "../ProductForm";
import s from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getFlatCategoryOptions();

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Nouveau produit</h1>
      </div>
      <ProductForm action={createProduct} categories={categories} submitLabel="Créer" />
    </div>
  );
}
