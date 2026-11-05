"use client";

import { useActionState } from "react";
import type { CategoryFormState } from "./actions";
import s from "../../admin.module.css";

type RootCategory = { id: string; name: string };

type Props = {
  action: (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  rootCategories: RootCategory[];
  defaults?: { name?: string; position?: number; parentId?: string | null };
  submitLabel: string;
};

const initialState: CategoryFormState = {};

export default function CategoryForm({ action, rootCategories, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form className={s.form} action={formAction}>
      <label>
        Nom
        <input type="text" name="name" defaultValue={defaults?.name ?? ""} required />
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
      {state.error && <p className={s.formError}>{state.error}</p>}
      <div className={s.formActions}>
        <button type="submit" className={s.button} disabled={pending}>
          {pending ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
