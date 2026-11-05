"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import s from "../admin.module.css";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className={s.loginWrap}>
      <form className={s.loginForm} action={formAction}>
        <h1>Connexion</h1>
        <label>
          Identifiant
          <input type="text" name="username" autoComplete="username" required />
        </label>
        <label>
          Mot de passe
          <input type="password" name="password" autoComplete="current-password" required />
        </label>
        {state.error && <p className={s.formError}>{state.error}</p>}
        <button type="submit" disabled={pending}>
          {pending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
