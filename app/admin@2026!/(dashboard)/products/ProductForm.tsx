"use client";

import { useActionState } from "react";
import type { ProductFormState } from "./actions";
import ImagePicker from "./ImagePicker";
import DimensionsField, { type DimensionDefault } from "./DimensionsField";
import { UNIT_OPTIONS, STATUS_OPTIONS } from "@/lib/priceUnits";
import s from "../../admin.module.css";

export type FlatCategory = { id: string; label: string };
export type ExistingImage = { id: string; url: string };

type Props = {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: FlatCategory[];
  defaults?: {
    name?: string;
    description?: string;
    dimensions?: DimensionDefault[];
    priceUnit?: string | null;
    priceStatus?: string | null;
    categoryIds?: string[];
    position?: number;
    images?: ExistingImage[];
  };
  submitLabel: string;
};

const initialState: ProductFormState = {};

export default function ProductForm({ action, categories, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const selectedCategoryIds = defaults?.categoryIds ?? [];
  const existingImages = defaults?.images ?? [];

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
      <DimensionsField defaults={defaults?.dimensions} />
      <label>
        Unité de prix
        <select name="priceUnit" defaultValue={defaults?.priceUnit ?? ""}>
          <option value="">— Choisir —</option>
          {UNIT_OPTIONS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </label>
      <label>
        Statut (optionnel)
        <select name="priceStatus" defaultValue={defaults?.priceStatus ?? ""}>
          <option value="">— Aucun —</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <fieldset className={s.checkboxList}>
        <legend>Catégories / sous-catégories</legend>
        {categories.map((c) => (
          <label key={c.id} className={s.checkboxItem}>
            <input
              type="checkbox"
              name="categoryIds"
              value={c.id}
              defaultChecked={selectedCategoryIds.includes(c.id)}
            />
            {c.label}
          </label>
        ))}
      </fieldset>

      <label>
        Position
        <input type="number" name="position" defaultValue={defaults?.position ?? 0} />
      </label>

      {existingImages.length > 0 && (
        <fieldset className={s.checkboxList}>
          <legend>Photos actuelles (cocher pour supprimer)</legend>
          <div className={s.imageGrid}>
            {existingImages.map((img) => (
              <label key={img.id} className={s.imageThumb}>
                <img src={img.url} alt="" />
                <span className={s.imageRemove}>
                  <input type="checkbox" name="removeImageIds" value={img.id} /> Supprimer
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <ImagePicker name="images" label={existingImages.length > 0 ? "Ajouter des photos" : "Photos"} />

      {state.error && <p className={s.formError}>{state.error}</p>}
      <div className={s.formActions}>
        <button type="submit" className={s.button} disabled={pending}>
          {pending ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
