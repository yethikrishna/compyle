import { auth } from "@/lib/auth";
import ImageKit from "imagekit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const authenticationParams = imagekit.getAuthenticationParameters();

    return NextResponse.json({
      token: authenticationParams.token,
      expire: authenticationParams.expire,
      signature: authenticationParams.signature,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 },
    );
  }
}
