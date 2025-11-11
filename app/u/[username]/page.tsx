import AppDetailsClient from "@/app/u/[username]/client";
import { Header } from "@/components/custom/header";

export default async function UserDetails({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <>
      <Header />
      <AppDetailsClient username={username} />
    </>
  );
}
