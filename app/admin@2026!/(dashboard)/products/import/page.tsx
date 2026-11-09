import Link from "next/link";
import { ADMIN_BASE_PATH } from "@/lib/auth";
import { UNIT_OPTIONS, STATUS_OPTIONS } from "@/lib/priceUnits";
import ImportForm from "./ImportForm";
import s from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default function ImportProductsPage() {
  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Importer des produits (CSV)</h1>
        <Link href={`${ADMIN_BASE_PATH}/products`} className={`${s.button} ${s.buttonSecondary}`}>
          Retour
        </Link>
      </div>

      <p className={s.empty}>
        Colonnes attendues : <code>name</code>, <code>description</code>, <code>dimensions</code>,{" "}
        <code>price</code> (nombre), <code>priceUnit</code> (une valeur parmi : {UNIT_OPTIONS.join(", ")}),{" "}
        <code>priceStatus</code> (optionnel, une valeur parmi : {STATUS_OPTIONS.join(", ")}),{" "}
        <code>categories</code> (séparées par « | », ex. « Aménagement intérieur » ou « Aménagement intérieur
        &gt; Parquet »), <code>images</code> (URLs séparées par « | »), <code>position</code>. Un produit dont
        le nom correspond exactement à un produit existant sera mis à jour ; sinon il sera créé.
      </p>

      <ImportForm />
    </div>
  );
}
