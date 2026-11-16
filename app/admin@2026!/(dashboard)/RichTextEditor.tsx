"use client";

import { useRef } from "react";
import s from "../admin.module.css";

type Props = {
  name: string;
  defaultValue?: string | null;
  rows?: number;
};

const BUTTONS: { label: string; command: string; value?: string; title: string }[] = [
  { label: "G", command: "bold", title: "Gras" },
  { label: "I", command: "italic", title: "Italique" },
  { label: "S", command: "underline", title: "Souligné" },
  { label: "H3", command: "formatBlock", value: "H3", title: "Titre" },
  { label: "¶", command: "formatBlock", value: "P", title: "Paragraphe" },
  { label: "•", command: "insertUnorderedList", title: "Liste à puces" },
  { label: "1.", command: "insertOrderedList", title: "Liste numérotée" },
];

export default function RichTextEditor({ name, defaultValue, rows = 6 }: Props) {
  const editableRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  function sync() {
    if (editableRef.current && hiddenRef.current) {
      hiddenRef.current.value = editableRef.current.innerHTML;
    }
  }

  function runCommand(command: string, value?: string) {
    editableRef.current?.focus();
    document.execCommand(command, false, value);
    sync();
  }

  function addLink() {
    editableRef.current?.focus();
    const url = window.prompt("URL du lien :", "https://");
    if (url) document.execCommand("createLink", false, url);
    sync();
  }

  function removeLink() {
    editableRef.current?.focus();
    document.execCommand("unlink");
    sync();
  }

  return (
    <div className={s.richText}>
      <div className={s.richTextToolbar}>
        {BUTTONS.map((btn) => (
          <button
            key={btn.title}
            type="button"
            className={s.richTextButton}
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand(btn.command, btn.value);
            }}
          >
            {btn.label}
          </button>
        ))}
        <button
          type="button"
          className={s.richTextButton}
          title="Insérer un lien"
          onMouseDown={(e) => {
            e.preventDefault();
            addLink();
          }}
        >
          🔗
        </button>
        <button
          type="button"
          className={s.richTextButton}
          title="Retirer le lien"
          onMouseDown={(e) => {
            e.preventDefault();
            removeLink();
          }}
        >
          🔗⌫
        </button>
      </div>

      <div
        ref={editableRef}
        className={s.richTextEditable}
        style={{ minHeight: `${rows * 1.4}em` }}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        dangerouslySetInnerHTML={{ __html: defaultValue ?? "" }}
      />

      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue ?? ""} />
    </div>
  );
}
