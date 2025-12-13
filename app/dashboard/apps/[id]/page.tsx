import AppDetailsDashboard from "./client";

export default async function AppDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <AppDetailsDashboard id={id} />
    </>
  );
}
