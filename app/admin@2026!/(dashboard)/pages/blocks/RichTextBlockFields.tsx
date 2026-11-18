"use client";

import RichTextEditor from "../../RichTextEditor";

type Data = { html: string };

type Props = {
  index: number;
  data: Data;
  onChange: (patch: Partial<Data>) => void;
};

export default function RichTextBlockFields({ index, data, onChange }: Props) {
  return (
    <RichTextEditor
      name={`block_${index}_html`}
      defaultValue={data.html}
      rows={5}
      onChange={(html) => onChange({ html })}
    />
  );
}
