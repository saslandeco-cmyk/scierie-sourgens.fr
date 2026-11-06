"use client";

import { useActionState } from "react";
import { importProducts, type ImportState } from "./actions";
import s from "../../../admin.module.css";

const initialState: ImportState = {};

export default function ImportForm() {
  const [state, formAction, pending] = useActionState(importProducts, initialState);

  return (
    <div>
      <form className={s.form} action={formAction}>
        <label>
          Fichier CSV
          <input type="file" name="file" accept=".csv,text/csv" required />
        </label>
        {state.error && <p className={s.formError}>{state.error}</p>}
        <div className={s.formActions}>
          <button type="submit" className={s.button} disabled={pending}>
            {pending ? "Import en cours..." : "Importer"}
          </button>
        </div>
      </form>

      {state.summary && (
        <div className={s.card} style={{ marginTop: 24 }}>
          <p>
            <strong>{state.summary.created}</strong> créé(s), <strong>{state.summary.updated}</strong> mis à
            jour, <strong>{state.summary.errors}</strong> en erreur.
          </p>
          {state.summary.details.length > 0 && (
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Ligne</th>
                  <th>Nom</th>
                  <th>Résultat</th>
                </tr>
              </thead>
              <tbody>
                {state.summary.details.map((d) => (
                  <tr key={d.row}>
                    <td>{d.row}</td>
                    <td>{d.name}</td>
                    <td>
                      {d.status === "created" && "Créé"}
                      {d.status === "updated" && "Mis à jour"}
                      {d.status === "error" && <span className={s.formError}>{d.message}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
