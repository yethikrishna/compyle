import EditAPpDetails from "./client";

export default async function EditApp({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <EditAPpDetails id={id} />
    </>
  );
}
