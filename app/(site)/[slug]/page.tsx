import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlockRenderer from "../BlockRenderer";
import s from "../pages.module.css";

export const dynamic = "force-dynamic";

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { position: "asc" } } },
  });

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <div className={s.wrap}>
      <h1 className={s.title}>{page.title}</h1>
      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} type={block.type} data={block.data} />
      ))}
    </div>
  );
}
