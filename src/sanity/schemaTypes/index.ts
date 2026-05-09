import { type SchemaTypeDefinition } from 'sanity'
import { artwork } from './artwork'
import { collection } from './collection'
import { about } from './about'
import { legalPage } from './legalPage'
import { settings } from './settings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, collection, about, legalPage, settings],
}
