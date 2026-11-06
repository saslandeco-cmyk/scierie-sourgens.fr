import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/catalog";
import s from "../../catalogue.module.css";

export const dynamic = "force-dynamic";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}) {
  const { categorySlug, subcategorySlug } = await params;
  const subcategory = await getCategoryBySlug(subcategorySlug);

  if (!subcategory || subcategory.parent?.slug !== categorySlug) {
    notFound();
  }

  return (
    <div className={s.wrap}>
      <p className={s.breadcrumb}>
        <Link href="/catalogue">Catalogue</Link> /{" "}
        <Link href={`/catalogue/${categorySlug}`}>{subcategory.parent?.name}</Link> / {subcategory.name}
      </p>

      <h1 className={s.title}>{subcategory.name}</h1>
      {subcategory.description && <p className={s.description}>{subcategory.description}</p>}

      {subcategory.products.length === 0 ? (
        <p className={s.empty}>Aucun produit pour le moment.</p>
      ) : (
        <div className={s.productGrid}>
          {subcategory.products.map((product) => (
            <div key={product.id} className={s.productCard}>
              {product.images[0] && (
                <div className={s.productImage}>
                  <Image src={product.images[0].url} alt={product.name} fill sizes="(max-width: 480px) 100vw, 45vw" />
                </div>
              )}
              <div className={s.productBody}>
                <h3>{product.name}</h3>
                {product.description && <p>{product.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
