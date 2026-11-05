import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/catalog";
import s from "../catalogue.module.css";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category || category.parentId !== null) {
    notFound();
  }

  return (
    <div className={s.wrap}>
      <p className={s.breadcrumb}>
        <Link href="/catalogue">Catalogue</Link> / {category.name}
      </p>

      {category.bannerUrl && (
        <div className={s.banner}>
          <Image src={category.bannerUrl} alt={category.name} fill sizes="1080px" priority />
        </div>
      )}

      <h1 className={s.title}>{category.name}</h1>
      {category.description && <p className={s.description}>{category.description}</p>}

      {category.children.length === 0 && category.products.length === 0 && (
        <p className={s.empty}>Aucun contenu pour le moment.</p>
      )}

      {category.children.length > 0 && (
        <div className={s.grid}>
          {category.children.map((sub) => (
            <Link key={sub.id} href={`/catalogue/${category.slug}/${sub.slug}`} className={s.card}>
              {sub.bannerUrl && (
                <div className={s.cardImage}>
                  <Image src={sub.bannerUrl} alt={sub.name} fill sizes="220px" />
                </div>
              )}
              <div className={s.cardBody}>
                <h3>{sub.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {category.products.length > 0 && (
        <div className={s.grid}>
          {category.products.map((product) => (
            <div key={product.id} className={s.card}>
              {product.images[0] && (
                <div className={s.cardImage}>
                  <Image src={product.images[0].url} alt={product.name} fill sizes="220px" />
                </div>
              )}
              <div className={s.cardBody}>
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
