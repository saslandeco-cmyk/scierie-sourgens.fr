"use client";

import { useActionState } from "react";
import type { ProductFormState } from "./actions";
import s from "../../admin.module.css";

export type FlatCategory = { id: string; label: string };

type Props = {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: FlatCategory[];
  defaults?: { name?: string; description?: string; categoryId?: string; position?: number; imageUrl?: string | null };
  submitLabel: string;
};

const initialState: ProductFormState = {};

export default function ProductForm({ action, categories, defaults, submitLabel }: Props) {
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
        Catégorie / sous-catégorie
        <select name="categoryId" defaultValue={defaults?.categoryId ?? ""} required>
          <option value="" disabled>
            — Choisir —
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Position
        <input type="number" name="position" defaultValue={defaults?.position ?? 0} />
      </label>
      <label>
        Photo {defaults?.imageUrl ? "(laisser vide pour conserver l'actuelle)" : ""}
        <input type="file" name="image" accept="image/*" />
      </label>
      {defaults?.imageUrl && (
        <img src={defaults.imageUrl} alt="" style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 4 }} />
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
