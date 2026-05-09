import { Artwork as SanityArtwork, ArtworkSize } from './sanity'
import { Database } from './supabase'

export type { ArtworkSize }
export type ArtworkStock = Database['public']['Tables']['artwork_stock']['Row']

export interface ArtworkWithStock extends SanityArtwork {
  stock?: ArtworkStock[]
}
