import { HouseIcon, MapPinIcon, PhoneIcon, MailIcon } from "@/components/Icons";
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

      <div className={s.columns}>
        <div className={s.infoColumn}>
          <div className={s.infoRow}>
            <HouseIcon className={s.infoIcon} />
            <span>Scierie R. Sourgens</span>
          </div>
          <div className={s.infoRow}>
            <MapPinIcon className={s.infoIcon} />
            <span>
              1176 rue de Mézos
              <br />
              40170 Uza
            </span>
          </div>
          <div className={s.infoRow}>
            <PhoneIcon className={s.infoIcon} />
            <a href="tel:+33558428093">05 58 42 80 93</a>
          </div>
          <div className={s.infoRow}>
            <MailIcon className={s.infoIcon} />
            <a href="mailto:contact@scierie-sourgens.fr">contact@scierie-sourgens.fr</a>
          </div>

          <div className={s.map}>
            <iframe
              title="Localisation de la Scierie R. Sourgens à Uza"
              src="https://www.google.com/maps?q=1176+rue+de+M%C3%A9zos,+40170+Uza&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className={s.formColumn}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
