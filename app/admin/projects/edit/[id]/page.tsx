import { EditProject } from "@/components/admin/EditProject";
import { seed } from "@/lib/seed";

export const metadata = { title: "Edit Project" };

export function generateStaticParams() {
  return seed.map((p) => ({ id: p.id }));
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return <EditProject id={params.id} />;
}
