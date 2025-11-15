import { Header } from "@/components/custom/header";
import AppDetailsClient from "@/app/apps/[id]/client";
import Footer from "@/components/custom/footer";

export default async function AppDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <AppDetailsClient id={id} />
      <Footer />
    </>
  );
}
