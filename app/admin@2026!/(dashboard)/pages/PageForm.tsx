"use client";

import { useActionState } from "react";
import type { PageFormState } from "./actions";
import PageBlocksField, { type BlockRowDefault } from "./PageBlocksField";
import { PAGE_STATUS_OPTIONS } from "@/lib/pageStatus";
import s from "../../admin.module.css";

type Props = {
  action: (prevState: PageFormState, formData: FormData) => Promise<PageFormState>;
  defaults?: {
    title?: string;
    status?: string;
    blocks?: BlockRowDefault[];
  };
  submitLabel: string;
};

const initialState: PageFormState = {};

const STATUS_LABELS: Record<(typeof PAGE_STATUS_OPTIONS)[number], string> = {
  draft: "Brouillon (non visible sur le site)",
  published: "Publiée",
};

export default function PageForm({ action, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form className={s.form} action={formAction}>
      <label>
        Titre
        <input type="text" name="title" defaultValue={defaults?.title ?? ""} required />
      </label>
      <label>
        Statut
        <select name="status" defaultValue={defaults?.status ?? "draft"}>
          {PAGE_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <PageBlocksField defaults={defaults?.blocks} />

      {state.error && <p className={s.formError}>{state.error}</p>}
      <div className={s.formActions}>
        <button type="submit" className={s.button} disabled={pending}>
          {pending ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
