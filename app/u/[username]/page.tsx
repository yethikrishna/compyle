import AppDetailsClient from "@/app/u/[username]/client";

export default async function UserDetails({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <>
      <AppDetailsClient username={username} />
    </>
  );
}
