import { Session, User } from "better-auth";

export type AppCardProps = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  upvotes: number;
  image?: string;
};

export type ImageData = {
  image: string;
  imageProviderFileId?: string;
};

export type AuthInfo = {
  user: User;
  session: Session;
};
