import { AppDetailsClient } from "@/app/apps/[slug]/client";
import { getPublicAppDetails } from "@/server/app";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  try {
    const data = await getPublicAppDetails({ slug });

    if (!data) {
      return {
        title: "App Not Found",
        description: "This app does not exist",
        robots: { index: false },
      };
    }

    return {
      title: data.appDetails.name,
      description: data.appDetails.description,
      openGraph: {
        title: data.appDetails.name,
        description: data.appDetails.description,
        images: [{ url: data.appDetails.coverImage || "" }],
      },
      twitter: {
        card: "summary_large_image",
        title: data.appDetails.name,
        description: data.appDetails.description,
        images: [{ url: data.appDetails.coverImage || "" }],
      },
    };
  } catch {
    return {
      title: "App Not Found",
      description: "This app does not exist",
      robots: { index: false },
    };
  }
}

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
