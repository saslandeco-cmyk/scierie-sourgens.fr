import Header from "@/components/Header";
import { getNavCategories } from "@/lib/catalog";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const navCategories = await getNavCategories().catch(() => []);

  return (
    <>
      <Header categories={navCategories} />
      {children}
    </>
  );
}
