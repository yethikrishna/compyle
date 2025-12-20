"use server";

import { getUserFromAuth } from "@/server/user";
import NodeImageKit from "@imagekit/nodejs";
import ImageKit from "imagekit";
import { env } from "@/env/server";

const client = new NodeImageKit({
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
});

const imagekit = new ImageKit({
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

export async function authenticateFileServer(): Promise<{
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}> {
  try {
    const authenticationParams = imagekit.getAuthenticationParameters();

    return {
      token: authenticationParams.token,
      expire: authenticationParams.expire,
      signature: authenticationParams.signature,
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
    };
  } catch {
    throw new Error("Failed to authenticate file server");
  }
}

export async function deleteFile({
  fileId,
}: {
  fileId: string | undefined;
}): Promise<void> {
  try {
    if (!fileId) {
      throw new Error("Invalid file ID");
    }

    await getUserFromAuth();
    await client.files.delete(fileId);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to delete file");
  }
}
