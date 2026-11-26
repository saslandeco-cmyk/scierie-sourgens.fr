import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/catalog";
import { formatPrice, formatStatus } from "@/lib/priceUnits";
import ProductGallery from "../../ProductGallery";
import RealisationsGallery from "../../RealisationsGallery";
import s from "../../catalogue.module.css";

export const dynamic = "force-dynamic";

const DIMENSION_LABEL_EXTRA_CLASS: Record<string, string> = {
  "OSB 3": s.dimensionLabelOsb3,
  "PLANCHES CLOTURE A EMBOITER CL4 VERT": s.dimensionLabelPlanchesCloture,
  "PARQUET À CLOUER XXL PIN DES LANDES": s.dimensionLabelParquetXxl,
  "POTEAUX ET GANIVELLE CHÂTAIGNIER SCIÉE, DOUBLE TORSION, CLOTURE GIRONDINE": s.dimensionLabelGanivelle,
  "RONDINS ET DEMIS RONDINS AUTOCLAVE VERT": s.dimensionLabelRondins,
  "ROULEAU DE GRILLAGE 50ML": s.dimensionLabelGrillage,
  "Poteaux en châtaignier épointés": s.dimensionLabelPoteauxChataignier,
  "TÔLE RUSTICA FLORENCE ANTHIQUE": s.dimensionLabelToleRustica,
  "BARDAGE PIN DES LANDES ET COUVRE JOINTS BRUT DE SCIAGE - AUTOCLAVE MARRON": s.dimensionLabelBardagePinMarron,
  "CLINS DE BARDAGE PIN DES LANDES": s.dimensionLabelClinsBardage,
};

const SINGLE_COLUMN_DIMENSION_PRODUCTS = new Set([
  "POTEAUX ET GANIVELLE CHÂTAIGNIER SCIÉE, DOUBLE TORSION, CLOTURE GIRONDINE",
]);

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
      {subcategory.description && (
        <div className={s.description} dangerouslySetInnerHTML={{ __html: subcategory.description }} />
      )}

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
                              className={[s.dimensionLabel, DIMENSION_LABEL_EXTRA_CLASS[product.name]]
                                .filter(Boolean)
                                .join(" ")}
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
                      <div
                        className={
                          dimensionRows.length > 6 && !SINGLE_COLUMN_DIMENSION_PRODUCTS.has(product.name)
                            ? s.dimensionListTwoCol
                            : undefined
                        }
                      >
                        {dimensionRows}
                      </div>
                    );
                  })()}
                  {statusText && (
                    <p>
                      <span className={s.priceStatus}>{statusText}</span>
                    </p>
                  )}
                  {product.longDescription && (
                    <div className={s.longDescription} dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                  )}
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
              const targetCategory =
                product.categories.find((c) => c.parentId !== null) ?? product.categories[0];
              const href = targetCategory
                ? targetCategory.parent
                  ? `/catalogue/${targetCategory.parent.slug}/${targetCategory.slug}`
                  : `/catalogue/${targetCategory.slug}`
                : "/catalogue";
              return (
                <Link key={product.id} href={href} className={s.card}>
                  {product.images[0] && (
                    <div className={s.cardImage}>
                      <Image src={product.images[0].url} alt={product.name} fill sizes="220px" />
                      <div className={s.cardImageOverlay}>
                        <span className={s.cardImageOverlayButton}>Voir le produit</span>
                      </div>
                    </div>
                  )}
                  <div className={s.cardBody}>
                    <h3>{product.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {subcategory.realisationImages.length > 0 && (
        <>
          <h2 className={`${s.title} ${s.suggestedTitle}`}>Réalisations clients</h2>
          <RealisationsGallery images={subcategory.realisationImages} />
        </>
      )}
    </div>
  );
}
