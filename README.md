# dev-scierie-sourgens.fr

Page d'accueil du site de la **Scierie R. Sourgens** (Uza, Landes), réalisée avec **Next.js 16** (App Router), React 19 et TypeScript.

## Démarrage

Prérequis : Node.js 20.9 ou plus récent.

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

Build de production :

```bash
npm run build
npm start
```

## Structure

```
app/
  layout.tsx          # <html>, polices, métadonnées SEO
  page.tsx            # page d'accueil (hero, histoire, savoir-faire, valeurs, contact)
  globals.css         # variables de couleurs / polices
components/
  Header.tsx          # en-tête + menu (burger sur mobile)
  Icons.tsx           # logo pomme de pin, icônes, illustration forêt (SVG)
  home.module.css     # styles de la page
public/images/        # photos
```

## À personnaliser

- **Photos** : les images de `public/images/` sont des visuels provisoires extraits de la maquette (basse résolution). Remplacez-les par vos vraies photos en gardant les mêmes noms de fichiers.
- **Contact** : le bouton « Nous contacter » pointe vers `mailto:contact@scierie-sourgens.fr` dans `app/page.tsx`. À adapter (adresse réelle ou future page `/contact`).
- **Couleurs et polices** : centralisées dans `app/globals.css` (Montserrat, Josefin Sans, Mulish, Allura — embarquées via Fontsource, aucun appel à Google Fonts).
