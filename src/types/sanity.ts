export interface ArtworkSize {
  sizeId: string;
  label: string;
  widthCm: number;
  heightCm: number;
}

export interface Artwork {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  type: 'photo' | 'peinture';
  mainImage: any;
  year: number;
  location?: string;
  continent?: string;
  availableInShop: boolean;
  featured: boolean;
  shortDescription?: string;
  longDescription?: any;
  sizes?: ArtworkSize[];
}
