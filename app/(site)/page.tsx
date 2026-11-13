import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CladdingIcon,
  ClockIcon,
  DeckIcon,
  FamilyIcon,
  HouseIcon,
  MapPinIcon,
  ParquetIcon,
  PhoneIcon,
  PineCone,
  PineForest,
  PlanksIcon,
  RingsIcon,
  TreesIcon,
  TruckIcon,
} from "@/components/Icons";
import s from "@/components/home.module.css";

const timeline = [
  { Icon: TruckIcon, title: "1928", text: ["Scieur", "itinérant"] },
  { Icon: HouseIcon, title: "1936", text: ["Installation", "à Uza"] },
  { Icon: FamilyIcon, title: "3 générations", text: ["Transmission", "du savoir-faire"] },
  { Icon: TreesIcon, title: "Aujourd’hui", text: ["Scierie familiale", "au cœur des Landes"] },
];

const products = [
  {
    img: "/images/bois-construction.jpg",
    Icon: PlanksIcon,
    label: ["Bois de", "construction"],
    href: "/catalogue/bois-de-charpente",
  },
  { img: "/images/terrasses.jpg", Icon: DeckIcon, label: ["Terrasses"], href: "/catalogue" },
  { img: "/images/bardages.jpg", Icon: CladdingIcon, label: ["Bardages /", "clins"], href: "/catalogue" },
  { img: "/images/parquets.jpg", Icon: ParquetIcon, label: ["Aménagement", "intérieurs"], href: "/catalogue" },
  { img: "/images/bois-sur-mesure.jpg", Icon: RingsIcon, label: ["Aménagement", "extérieur"], href: "/catalogue" },
  {
    img: "/images/pin-des-landes.jpg",
    Icon: PineCone,
    label: ["Entretien du bois ", "et quincaillerie"],
    href: "/catalogue",
  },
];

export default function Home() {
  return (
    <>
      <main>
        {/* ---------------- HERO ---------------- */}
        <section id="accueil" className={s.hero}>
          <div className={s.heroPhoto}>
            <Image
              src="/images/hero-1928.jpg"
              alt="L’équipe de la scierie posant devant un tracteur forestier, photo d’archive"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 65vw"
            />
          </div>
          <div className={s.heroText}>
            <p className={s.heroScript}>Un savoir-faire familial</p>
            <h1 className={s.heroTitle}>Depuis 1928</h1>
            <span className={s.heroRule} />
            <p className={s.heroTags}>
              Bois <span>·</span> Forêt <span>·</span> Landes
            </p>
          </div>
        </section>

        {/* ---------------- HISTOIRE ---------------- */}
        <section id="histoire" className={s.story}>
          <div className={s.storyText}>
            <h2 className={s.storyTitle}>
              Une histoire de famille
              <span className={s.storyScript}>au cœur des Landes</span>
            </h2>
            <span className={s.storyRule} />
            <p>
              La <strong>Scierie</strong> R. Sourgens commence en 1928, lorsque M. R. Sourgens devient scieur
              itinérant.
            </p>
            <p>
              En 1936, l’activité s’installe à Uza, au cœur des Landes. Depuis, trois générations se sont succédé et
              ont transmis leur savoir-faire autour du pin des Landes et de l’exploitation forestière.
            </p>
            <p>
              Au fil des années, la scierie a traversé les évolutions du métier et les grandes tempêtes qui ont marqué
              notre forêt, tout en conservant une même exigence&nbsp;: proposer du bois de qualité et répondre au plus
              près aux besoins de nos clients.
            </p>
          </div>

          <div className={s.timelineCard}>
            <ol className={s.timeline}>
              {timeline.map(({ Icon, title, text }) => (
                <li key={title}>
                  <span className={s.timelineIcon}>
                    <Icon />
                  </span>
                  <strong>{title}</strong>
                  <span>
                    {text[0]}
                    <br />
                    {text[1]}
                  </span>
                </li>
              ))}
            </ol>
            <div className={s.timelineForest}>
              <PineForest className={s.forestSvg} />
              <p className={s.forestScript}>
                Le pin des Landes,
                <br />
                <span>notre richesse</span>
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- SAVOIR-FAIRE ---------------- */}
        <section id="produits" className={s.skills}>
          <h2 className={s.skillsTitle}>Notre savoir-faire</h2>
          <p className={s.skillsSub}>
            De la <strong>scierie</strong> aux réalisations en bois,
            <br />
            nous vous accompagnons avec&nbsp;:
          </p>

          <ul className={s.products}>
            {products.map(({ img, Icon, label, href }) => (
              <li key={img} className={s.product}>
                <div className={s.productImg}>
                  <Image src={img} alt={label.join(" ")} fill sizes="(max-width: 700px) 50vw, 17vw" />
                  <div className={s.productOverlay}>
                    <Link href={href} className={s.productOverlayButton}>
                      Voir les produits
                    </Link>
                  </div>
                </div>
                <div className={s.productLabel}>
                  <Icon className={s.productIcon} />
                  <span>
                    {label[0]}
                    {label[1] && (
                      <>
                        <br />
                        {label[1]}
                      </>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <p className={s.skillsScript}>
            Une équipe à taille humaine, un savoir-faire transmis de génération en génération
            <br />
            et une vraie connaissance du bois local.
          </p>
        </section>

        {/* ---------------- VALEURS ---------------- */}
        <section className={s.values} aria-label="Nos valeurs">
          <div className={s.valuesCol}>
            <div className={s.valuesRow}>
              <MapPinIcon className={s.valuesIcon} />
              <span>
                1176 rue de Mézos
                <br />
                40170 Uza
              </span>
            </div>
          </div>
          <div className={s.valuesCol}>
            <div className={s.valuesRow}>
              <PhoneIcon className={s.valuesIcon} />
              <span>05 58 42 80 93</span>
            </div>
            <div className={`${s.valuesRow} ${s.valuesRowBordered}`}>
              <ClockIcon className={s.valuesIcon} />
              <span>
                Du Lundi au vendredi
                <br />
                9h - 12h | 14h - 16h30
              </span>
            </div>
          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section id="contact" className={s.cta}>
          <div className={s.ctaBg}>
            <Image src="/images/foret-coucher.jpg" alt="" fill sizes="100vw" />
          </div>
          <div className={s.ctaLogs}>
            <Image src="/images/buches.jpg" alt="" fill sizes="30vw" />
          </div>

          <div className={s.ctaInner}>
            <div className={s.ctaLeft}>
              <h2 className={s.ctaScript}>Un projet en bois&nbsp;?</h2>
              <p className={s.ctaTitle}>Parlons-en.</p>
              <a href="mailto:contact@scierie-sourgens.fr" className={s.ctaButton}>
                Nous contacter <ArrowRight className={s.ctaArrow} />
              </a>
            </div>

            <div className={s.ctaRight}>
              <PineCone className={s.ctaCone} />
              <p className={s.ctaBrand}>Scierie R. Sourgens</p>
              <p className={s.ctaPlace}>Uza · Landes</p>
              <p className={s.ctaMotto}>
                Votre bois, notre savoir-faire
                <br />
                depuis 1928.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
