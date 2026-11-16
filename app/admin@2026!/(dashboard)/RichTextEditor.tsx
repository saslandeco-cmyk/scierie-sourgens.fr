"use client";

import { useRef } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import s from "../admin.module.css";

type Props = {
  name: string;
  defaultValue?: string | null;
  rows?: number;
};

function ToolbarButton({
  editor,
  title,
  isActive,
  onClick,
  children,
}: {
  editor: Editor;
  title: string;
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${s.richTextButton} ${isActive ? s.richTextButtonActive : ""}`}
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={!editor.isEditable}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ name, defaultValue, rows = 6 }: Props) {
  const hiddenRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
        link: { openOnClick: false, autolink: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } },
      }),
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        class: s.richTextEditable,
        style: `min-height:${rows * 1.4}em`,
      },
    },
    onUpdate: ({ editor }) => {
      if (hiddenRef.current) hiddenRef.current.value = editor.getHTML();
    },
  });

  if (!editor) {
    return (
      <div className={s.richText}>
        <input type="hidden" name={name} defaultValue={defaultValue ?? ""} />
      </div>
    );
  }

  return (
    <div className={s.richText}>
      <div className={s.richTextToolbar}>
        <ToolbarButton editor={editor} title="Gras" isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          G
        </ToolbarButton>
        <ToolbarButton editor={editor} title="Italique" isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </ToolbarButton>
        <ToolbarButton editor={editor} title="Souligné" isActive={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          S
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          title="Titre"
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton editor={editor} title="Paragraphe" isActive={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
          ¶
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          title="Liste à puces"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          title="Liste numérotée"
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          title="Insérer un lien"
          isActive={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("URL du lien :", "https://");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          🔗
        </ToolbarButton>
        <ToolbarButton editor={editor} title="Retirer le lien" onClick={() => editor.chain().focus().unsetLink().run()}>
          🔗⌫
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue ?? ""} />
    </div>
  );
}
