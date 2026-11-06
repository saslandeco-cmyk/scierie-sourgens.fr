"use client";

import { useActionState } from "react";
import type { CategoryFormState } from "./actions";
import s from "../../admin.module.css";

type RootCategory = { id: string; name: string };
type ProductOption = { id: string; name: string };

type Props = {
  action: (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  rootCategories: RootCategory[];
  allProducts?: ProductOption[];
  defaults?: {
    name?: string;
    description?: string;
    position?: number;
    parentId?: string | null;
    bannerUrl?: string | null;
    suggestedProductIds?: string[];
  };
  submitLabel: string;
};

const initialState: CategoryFormState = {};

export default function CategoryForm({ action, rootCategories, allProducts, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form className={s.form} action={formAction}>
      <label>
        Nom
        <input type="text" name="name" defaultValue={defaults?.name ?? ""} required />
      </label>
      <label>
        Description
        <textarea name="description" rows={4} defaultValue={defaults?.description ?? ""} />
      </label>
      <label>
        Catégorie parente (laisser vide pour une catégorie racine)
        <select name="parentId" defaultValue={defaults?.parentId ?? ""}>
          <option value="">— Aucune (catégorie racine) —</option>
          {rootCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Position
        <input type="number" name="position" defaultValue={defaults?.position ?? 0} />
      </label>

      {defaults?.bannerUrl && (
        <div>
          <img
            src={defaults.bannerUrl}
            alt=""
            style={{ width: "100%", maxWidth: 320, height: 120, objectFit: "cover", borderRadius: 4 }}
          />
          <label className={s.checkboxItem} style={{ marginTop: 6 }}>
            <input type="checkbox" name="removeBanner" /> Supprimer la bannière actuelle
          </label>
        </div>
      )}

      <label>
        {defaults?.bannerUrl ? "Remplacer la bannière" : "Bannière"}
        <input type="file" name="banner" accept="image/*" />
      </label>

      {allProducts && allProducts.length > 0 && (
        <fieldset className={s.checkboxList}>
          <legend>
            Produits additionnels (affichés en front-office sous « Vous pourriez avoir besoin de : »)
          </legend>
          {allProducts.map((p) => (
            <label key={p.id} className={s.checkboxItem}>
              <input
                type="checkbox"
                name="suggestedProductIds"
                value={p.id}
                defaultChecked={defaults?.suggestedProductIds?.includes(p.id)}
              />
              {p.name}
            </label>
          ))}
        </fieldset>
      )}

      {state.error && <p className={s.formError}>{state.error}</p>}
      <div className={s.formActions}>
        <button type="submit" className={s.button} disabled={pending}>
          {pending ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
