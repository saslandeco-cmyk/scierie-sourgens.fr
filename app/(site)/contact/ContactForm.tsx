"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactFormState } from "./actions";
import { INTEREST_OPTIONS } from "./constants";
import s from "./contact.module.css";

const initialState: ContactFormState = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  if (state.success) {
    return (
      <p className={s.success}>
        Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.
      </p>
    );
  }

  return (
    <form className={s.form} action={formAction}>
      <div className={s.row}>
        <label>
          Nom
          <input type="text" name="lastName" required />
        </label>
        <label>
          Prénom
          <input type="text" name="firstName" />
        </label>
      </div>

      <label>
        Société
        <input type="text" name="company" />
      </label>

      <div className={s.row}>
        <label>
          Adresse email
          <input type="email" name="email" required />
        </label>
        <label>
          Numéro de téléphone
          <input type="tel" name="phone" required />
        </label>
      </div>

      <div className={s.row}>
        <label>
          Adresse postale
          <input type="text" name="address" required />
        </label>
        <label>
          Code postal et ville
          <input type="text" name="postalCity" required />
        </label>
      </div>

      <label>
        Vous êtes intéressé par
        <select name="interest" required defaultValue="">
          <option value="" disabled>
            — Choisir —
          </option>
          {INTEREST_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        Votre message
        <textarea name="message" rows={5} />
      </label>

      <label className={s.checkboxLabel}>
        <input type="checkbox" name="rgpd" required />
        Je consens à ce que le site scierie-sourgens.fr collecte mes informations personnelles ci-dessus afin de
        pouvoir répondre à ma demande.
      </label>

      {state.error && <p className={s.error}>{state.error}</p>}

      <button type="submit" className={s.submit} disabled={pending}>
        {pending ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
