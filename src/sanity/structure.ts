import type { StructureResolver } from 'sanity/structure'
import { Settings, User, Image, FileText, Layout } from 'lucide-react'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      // Configuration Globale (Singleton)
      S.listItem()
        .title('Configuration Globale')
        .id('settings')
        .icon(Settings)
        .child(
          S.document()
            .schemaType('settings')
            .documentId('settings')
        ),
      
      // Artiste / Bio (Singleton)
      S.listItem()
        .title('Artiste & Bio')
        .id('about')
        .icon(User)
        .child(
          S.document()
            .schemaType('about')
            .documentId('about')
        ),

      S.divider(),

      // Collections
      S.documentTypeListItem('collection')
        .title('Collections')
        .icon(Layout),

      // Artworks
      S.documentTypeListItem('artwork')
        .title('Œuvres')
        .icon(Image),

      S.divider(),

      // Legal Pages
      S.documentTypeListItem('legalPage')
        .title('Pages Légales')
        .icon(FileText),

      // On filtre les singletons de la liste "tous les documents"
      ...S.documentTypeListItems().filter(
        (listItem) => !['settings', 'about', 'artwork', 'collection', 'legalPage'].includes(listItem.getId()!)
      ),
    ])
