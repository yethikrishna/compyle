export type AppCardProps = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  upvotes: number;
  image?: string;
};

export interface ImageData {
  image: string;
  imageProviderFileId?: string;
}
