import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePage } from "../../actions";
import PageForm from "../../PageForm";
import { blockDataToRow, type BlockType } from "@/lib/pageBlocks";
import s from "../../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  if (!page) {
    notFound();
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Modifier « {page.title} »</h1>
      </div>
      <PageForm
        action={updatePage.bind(null, id)}
        defaults={{
          title: page.title,
          status: page.status,
          blocks: page.blocks.map((b) => ({
            type: b.type as BlockType,
            data: blockDataToRow(b.type as BlockType, b.data as Record<string, unknown>),
          })),
        }}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
