"use client";

type Data = { text: string; href: string; style: "primary" | "secondary" };

type Props = {
  data: Data;
  onChange: (patch: Partial<Data>) => void;
};

export default function CtaBlockFields({ data, onChange }: Props) {
  return (
    <>
      <label>
        Texte du bouton
        <input type="text" value={data.text} onChange={(e) => onChange({ text: e.target.value })} />
      </label>
      <label>
        Lien (URL)
        <input
          type="text"
          value={data.href}
          onChange={(e) => onChange({ href: e.target.value })}
          placeholder="https://... ou /catalogue"
        />
      </label>
      <label>
        Style
        <select value={data.style} onChange={(e) => onChange({ style: e.target.value as "primary" | "secondary" })}>
          <option value="primary">Plein (vert)</option>
          <option value="secondary">Discret</option>
        </select>
      </label>
    </>
  );
}
