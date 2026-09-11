import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaContent } from "@/components/areas/AreaContent";
import { getAreaBySeoSlug, serviceAreas } from "@/lib/areas";

type PageProps = {
  params: Promise<{ seoSlug: string }>;
};

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ seoSlug: area.seoSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seoSlug } = await params;
  const area = getAreaBySeoSlug(seoSlug);
  if (!area) return { title: "Dryer vent cleaning" };
  return {
    title: area.title,
    description: area.intro,
  };
}

export default async function SeoAreaPage({ params }: PageProps) {
  const { seoSlug } = await params;
  const area = getAreaBySeoSlug(seoSlug);
  if (!area) notFound();
  return <AreaContent area={area} />;
}
