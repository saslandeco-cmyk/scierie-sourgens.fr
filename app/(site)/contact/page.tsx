import ContactForm from "./ContactForm";
import s from "./contact.module.css";

export const metadata = {
  title: "Contact — Scierie R. Sourgens",
};

export default function ContactPage() {
  return (
    <div className={s.wrap}>
      <h1 className={s.title}>Contact</h1>
      <p className={s.intro}>
        Une question, un projet&nbsp;? Remplissez le formulaire ci-dessous, nous vous répondrons rapidement.
      </p>
      <ContactForm />
    </div>
  );
}
