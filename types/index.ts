type CustomUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  username?: string | null | undefined;
  displayUsername?: string | null | undefined;
};

type CustomSession = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
};

export type AuthInfo = {
  user: CustomUser;
  session: CustomSession;
};

export type AppCardProps = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  upvotes: number;
  coverImage?: string;
};
