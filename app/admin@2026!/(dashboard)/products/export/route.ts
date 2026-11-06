import { exportProductsCsv } from "@/lib/productCsv";

export async function GET() {
  const csv = await exportProductsCsv();

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="produits.csv"',
    },
  });
}
