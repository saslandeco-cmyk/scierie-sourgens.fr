import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/catalog";
import { formatPrice, formatStatus } from "@/lib/priceUnits";
import ProductGallery from "../../ProductGallery";
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
          {subcategory.products.map((product) => {
            const statusText = formatStatus(product.priceStatus);
            return (
              <div key={product.id} className={s.productCard}>
                <ProductGallery images={product.images} name={product.name} />
                <div className={s.productBody}>
                  <h3>{product.name}</h3>
                  {(() => {
                    const dimensionRows = product.dimensions
                      .map((d) => {
                        const priceText = formatPrice(d.price, product.priceUnit, d.priceUnitSuffix);
                        if (!d.dimension && !priceText && !d.description) return null;
                        return (
                          <p key={d.id} className={s.dimensionRow}>
                            <span
                              className={
                                product.name === "OSB 3" ||
                                product.name === "PLANCHES CLOTURE A EMBOITER CL4 VERT"
                                  ? `${s.dimensionLabel} ${s.dimensionLabelOsb3}`
                                  : s.dimensionLabel
                              }
                            >
                              {d.description}
                              {d.description && d.dimension && " "}
                              {d.dimension}
                            </span>
                            {priceText && <span className={s.priceTag}>{priceText}</span>}
                          </p>
                        );
                      })
                      .filter(Boolean);
                    return (
                      <div className={dimensionRows.length > 6 ? s.dimensionListTwoCol : undefined}>
                        {dimensionRows}
                      </div>
                    );
                  })()}
                  {statusText && (
                    <p>
                      <span className={s.priceStatus}>{statusText}</span>
                    </p>
                  )}
                  {product.longDescription && <p>{product.longDescription}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {subcategory.suggestedProducts.length > 0 && (
        <>
          <h2 className={`${s.title} ${s.suggestedTitle}`}>Vous pourriez avoir besoin de :</h2>
          <div className={s.grid}>
            {subcategory.suggestedProducts.map((product) => {
              const statusText = formatStatus(product.priceStatus);
              return (
                <div key={product.id} className={s.card}>
                  {product.images[0] && (
                    <div className={s.cardImage}>
                      <Image src={product.images[0].url} alt={product.name} fill sizes="220px" />
                    </div>
                  )}
                  <div className={s.cardBody}>
                    <h3>{product.name}</h3>
                    {(() => {
                      const dimensionRows = product.dimensions
                        .map((d) => {
                          const priceText = formatPrice(d.price, product.priceUnit, d.priceUnitSuffix);
                          if (!d.dimension && !priceText && !d.description) return null;
                          return (
                            <p key={d.id} className={s.dimensionRow}>
                              <span className={s.dimensionLabel}>
                                {d.description}
                                {d.description && d.dimension && " "}
                                {d.dimension}
                              </span>
                              {priceText && <span className={s.priceTag}>{priceText}</span>}
                            </p>
                          );
                        })
                        .filter(Boolean);
                      return (
                        <div className={dimensionRows.length > 6 ? s.dimensionListTwoCol : undefined}>
                          {dimensionRows}
                        </div>
                      );
                    })()}
                    {statusText && (
                      <p>
                        <span className={s.priceStatus}>{statusText}</span>
                      </p>
                    )}
                    {product.longDescription && <p>{product.longDescription}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
