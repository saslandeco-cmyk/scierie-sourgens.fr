"use client";

import ImagePicker from "../../products/ImagePicker";
import s from "../../../admin.module.css";

type Data = { existingUrls: string[] };

type Props = {
  index: number;
  data: Data;
  onChange: (patch: Partial<Data>) => void;
};

export default function GalleryBlockFields({ index, data, onChange }: Props) {
  function removeExisting(url: string) {
    onChange({ existingUrls: data.existingUrls.filter((u) => u !== url) });
  }

  return (
    <>
      {data.existingUrls.length > 0 && (
        <div className={s.imageGrid}>
          {data.existingUrls.map((url) => (
            <label key={url} className={s.imageThumb}>
              <img src={url} alt="" />
              <span className={s.imageRemove}>
                <input type="checkbox" onChange={() => removeExisting(url)} /> Supprimer
              </span>
            </label>
          ))}
        </div>
      )}
      <ImagePicker
        name={`block_${index}_images`}
        label={data.existingUrls.length > 0 ? "Ajouter des photos" : "Photos"}
      />
    </>
  );
}
