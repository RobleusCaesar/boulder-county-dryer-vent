import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaContent } from "@/components/areas/AreaContent";
import { getArea, serviceAreas } from "@/lib/areas";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return { title: "Service area" };
  return {
    title: area.title,
    description: area.intro,
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();
  return <AreaContent area={area} />;
}
