import { demoJobIds } from "@/lib/crm/mock";
import { JobDetail } from "@/components/portal/JobDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return demoJobIds.map((id) => ({ id }));
}

export default async function PortalJobPage({ params }: PageProps) {
  const { id } = await params;
  return <JobDetail id={id} />;
}
