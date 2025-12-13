import { AppDetailsClient } from "@/app/apps/[slug]/client";

export default async function AppDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <AppDetailsClient slug={slug} />
    </>
  );
}
