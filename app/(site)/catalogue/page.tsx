import Link from "next/link";
import Image from "next/image";
import { getCategoryTree } from "@/lib/catalog";
import s from "./catalogue.module.css";

export const dynamic = "force-dynamic";

export default async function CataloguePage() {
  const categories = await getCategoryTree();

  return (
    <div className={s.wrap}>
      <h1 className={s.title}>Notre catalogue</h1>

      {categories.length === 0 ? (
        <p className={s.empty}>Le catalogue sera bientôt disponible.</p>
      ) : (
        <div className={s.grid}>
          {categories.map((category) => (
            <Link key={category.id} href={`/catalogue/${category.slug}`} className={s.card}>
              {category.bannerUrl && (
                <div className={s.cardImage}>
                  <Image src={category.bannerUrl} alt={category.name} fill sizes="220px" />
                </div>
              )}
              <div className={s.cardBody}>
                <h3>{category.name}</h3>
                <p>
                  {category.children.length > 0
                    ? `${category.children.length} sous-catégorie(s)`
                    : `${category.products.length} produit(s)`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
