import { createPage } from "../actions";
import PageForm from "../PageForm";
import s from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewPagePage() {
  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Nouvelle page</h1>
      </div>
      <PageForm action={createPage} submitLabel="Créer" />
    </div>
  );
}
