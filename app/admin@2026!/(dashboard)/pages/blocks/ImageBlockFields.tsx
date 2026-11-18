"use client";

import s from "../../../admin.module.css";

type Data = { existingUrl: string | null; alt: string };

type Props = {
  index: number;
  data: Data;
  onChange: (patch: Partial<Data>) => void;
};

export default function ImageBlockFields({ index, data, onChange }: Props) {
  return (
    <>
      {data.existingUrl && (
        <div>
          <img
            src={data.existingUrl}
            alt=""
            style={{ width: "100%", maxWidth: 240, height: 120, objectFit: "cover", borderRadius: 4 }}
          />
          <label className={s.checkboxItem} style={{ marginTop: 6 }}>
            <input type="checkbox" onChange={(e) => e.target.checked && onChange({ existingUrl: null })} />{" "}
            Supprimer cette image
          </label>
        </div>
      )}
      <label>
        {data.existingUrl ? "Remplacer l'image" : "Image"}
        <input type="file" name={`block_${index}_image`} accept="image/*" />
      </label>
      <label>
        Texte alternatif
        <input type="text" value={data.alt} onChange={(e) => onChange({ alt: e.target.value })} />
      </label>
    </>
  );
}
