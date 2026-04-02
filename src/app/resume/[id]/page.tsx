import { redirect } from "next/navigation";

export default async function LegacyResumeRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/builder/${id}`);
}
