type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ---------- Logo ---------- */
export function PineCone({ className }: IconProps) {
  // Pomme de pin : corps plein, écailles découpées par un masque
  const cuts: React.ReactElement[] = [];
  const rows = [26, 33, 40, 47, 54, 61, 68];
  rows.forEach((y, r) => {
    const n = r % 2 === 0 ? 4 : 5;
    for (let i = 0; i < n; i++) {
      const cx = 32 + (i - (n - 1) / 2) * 7;
      cuts.push(<path key={`${r}-${i}`} d={`M${cx - 4.2} ${y - 2} Q${cx} ${y + 4} ${cx + 4.2} ${y - 2}`} />);
    }
  });
  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden="true">
      <defs>
        <mask id="cone-mask">
          <rect width="64" height="80" fill="#fff" />
          <g fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round">
            {cuts}
          </g>
        </mask>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M32 21 L27 3 M32 21 L33 1 M32 21 L39 3 M32 21 L45 7 M32 21 L21 6 M32 21 L16 11 M32 21 L50 13 M32 21 L13 17 M32 21 L53 20" />
      </g>
      <path
        d="M32 19 C45 19 50 34 48 48 C46 62 39 76 32 78 C25 76 18 62 16 48 C14 34 19 19 32 19Z"
        fill="currentColor"
        mask="url(#cone-mask)"
      />
    </svg>
  );
}

/* ---------- Frise chronologique ---------- */
export function TruckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <path d="M5 30V20h22v10M27 22h7l5 5v3H27" />
      <path d="M5 30h34" />
      <circle cx="12" cy="32" r="3" />
      <circle cx="33" cy="32" r="3" />
      <path d="M8 17h16M8 14h16" />
    </svg>
  );
}

export function HouseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <path d="M8 22 24 10l16 12" />
      <path d="M11 20v16h26V20" />
      <path d="M21 36v-8h6v8" />
      <rect x="14" y="24" width="4" height="4" />
      <rect x="30" y="24" width="4" height="4" />
      <path d="M33 14v-3h3v5" />
    </svg>
  );
}

export function FamilyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <circle cx="24" cy="14" r="4" />
      <circle cx="13" cy="19" r="3.4" />
      <circle cx="35" cy="19" r="3.4" />
      <path d="M17 36v-8a7 7 0 0 1 14 0v8" />
      <path d="M7 36v-6a6 6 0 0 1 8-5.6M41 36v-6a6 6 0 0 0-8-5.6" />
    </svg>
  );
}

export function TreesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <path d="M24 6 16 18h4l-6 9h5l-6 8h22l-6-8h5l-6-9h4z" />
      <path d="M24 35v6" />
      <path d="M11 16 6 25h3l-4 7h12M37 16l5 9h-3l4 7H31" />
      <path d="M11 32v5M37 32v5" />
    </svg>
  );
}

/* ---------- Savoir-faire ---------- */
export function PlanksIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <path d="M6 30 30 18l12 6-24 12z" />
      <path d="M6 30v4l12 6v-4M18 40l24-12v-4" />
      <path d="M10 24 34 12l8 4" />
      <path d="M12 31l24-12" />
    </svg>
  );
}

export function DeckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <path d="M4 36 18 12h26L30 36z" />
      <path d="M11 36 25 12M18 36 32 12M24 36 38 12" />
      <path d="M4 36v3h26v-3M30 39 44 15v-3" />
    </svg>
  );
}

export function CladdingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <path d="M14 10h20v30H14z" />
      <path d="M14 10l6-4h20l-6 4M40 6v30l-6 4" />
      <path d="M19 10v30M24 10v30M29 10v30" />
    </svg>
  );
}

export function ParquetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <path d="M4 34 20 14h24L28 34z" />
      <path d="M10 34 26 14M16 34 32 14M22 34 38 14" />
      <path d="M4 34v3h24v-3M28 37l16-20v-3" />
    </svg>
  );
}

export function RingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="11.5" />
      <circle cx="24" cy="24" r="7" />
      <circle cx="24" cy="24" r="2.5" />
    </svg>
  );
}

export function SmallConeIcon({ className }: IconProps) {
  return <PineCone className={className} />;
}

/* ---------- Catalogue (icônes de catégories) ---------- */
export function FirewoodIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <circle cx="12" cy="16" r="5" />
      <circle cx="24" cy="16" r="5" />
      <circle cx="36" cy="16" r="5" />
      <circle cx="18" cy="27" r="5" />
      <circle cx="30" cy="27" r="5" />
      <path d="M16 38c0-6 4-11 8-14 4 3 8 8 8 14a8 8 0 0 1-16 0Z" />
    </svg>
  );
}

export function TreatmentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base}>
      <path d="M17 6h10v8l4 6v22a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V20l4-6Z" />
      <path d="M13 28h18M17 6h10" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base} strokeWidth={3}>
      <path d="M24 44S10 30.5 10 19a14 14 0 1 1 28 0c0 11.5-14 25-14 25Z" />
      <circle cx="24" cy="19" r="5" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base} strokeWidth={3}>
      <path d="M12 7h7l3 8-5 4c2.2 5 5.8 8.6 10.8 10.8l4-5 8 3v7c0 2-1.6 3.6-3.6 3.5C20.4 37.6 10.4 27.6 8.5 15.6 8.4 13.6 10 12 12 12Z" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...base} strokeWidth={3}>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 14v10l7 5" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.8}>
      <path d="M4 12h15M14 7l5 5-5 5" />
    </svg>
  );
}

/* ---------- Illustration forêt de pins ---------- */
export function PineForest({ className }: IconProps) {
  // Silhouettes de conifères générées de façon déterministe (même rendu serveur/client)
  const trees: React.ReactElement[] = [];
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const ground = 150;
  for (let layer = 0; layer < 2; layer++) {
    const count = layer === 0 ? 34 : 26;
    for (let i = 0; i < count; i++) {
      const x = (i / count) * 520 - 6 + rnd() * 10;
      const h = (layer === 0 ? 45 : 60) + rnd() * (layer === 0 ? 40 : 70);
      const w = h * (0.22 + rnd() * 0.08);
      const top = ground - h - (layer === 0 ? 8 : 0);
      const tiers = 5;
      let d = "";
      for (let t = 0; t < tiers; t++) {
        const ty = top + (t * h * 0.75) / tiers;
        const tw = (w * (t + 1.2)) / tiers;
        const by = ty + h * 0.26;
        d += `M${x} ${ty} L${x - tw} ${by} L${x + tw} ${by}Z `;
      }
      trees.push(
        <g key={`${layer}-${i}`} opacity={layer === 0 ? 0.4 : 0.85}>
          <path d={`M${x} ${top + h * 0.5} V${ground}`} stroke="currentColor" strokeWidth="1.4" />
          <path d={d} fill="currentColor" />
        </g>
      );
    }
  }
  return (
    <svg viewBox="0 0 500 150" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      {trees}
      <path d="M0 140 Q130 132 260 140 T500 136 V150 H0z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
