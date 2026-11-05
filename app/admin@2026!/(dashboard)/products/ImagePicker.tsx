"use client";

import { useEffect, useRef, useState } from "react";
import s from "../../admin.module.css";

type Props = {
  name: string;
  label: string;
};

type Entry = { file: File; url: string };

export default function ImagePicker({ name, label }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const pickerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      entries.forEach((entry) => URL.revokeObjectURL(entry.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncHiddenInput(next: Entry[]) {
    const dt = new DataTransfer();
    next.forEach((entry) => dt.items.add(entry.file));
    if (hiddenInputRef.current) {
      hiddenInputRef.current.files = dt.files;
    }
    setEntries(next);
  }

  function handlePick(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const added = Array.from(fileList).map((file) => ({ file, url: URL.createObjectURL(file) }));
    syncHiddenInput([...entries, ...added]);
    if (pickerInputRef.current) pickerInputRef.current.value = "";
  }

  function removeAt(index: number) {
    const target = entries[index];
    URL.revokeObjectURL(target.url);
    syncHiddenInput(entries.filter((_, i) => i !== index));
  }

  function moveTo(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || to >= entries.length) return;
    const next = [...entries];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    syncHiddenInput(next);
  }

  return (
    <div>
      <input ref={hiddenInputRef} type="file" name={name} multiple hidden />
      <label>
        {label}
        <input
          ref={pickerInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handlePick(e.target.files)}
        />
      </label>

      {entries.length > 0 && (
        <div className={s.pickerGrid}>
          {entries.map((entry, i) => (
            <div
              key={entry.url}
              className={s.pickerThumb}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) moveTo(dragIndex, i);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
            >
              <span className={s.pickerOrder}>{i + 1}</span>
              <img src={entry.url} alt="" />
              <div className={s.pickerActions}>
                <button type="button" onClick={() => moveTo(i, i - 1)} disabled={i === 0} aria-label="Déplacer avant">
                  ◂
                </button>
                <button type="button" onClick={() => removeAt(i)} aria-label="Retirer">
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => moveTo(i, i + 1)}
                  disabled={i === entries.length - 1}
                  aria-label="Déplacer après"
                >
                  ▸
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
