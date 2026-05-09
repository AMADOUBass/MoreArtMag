import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/studio',
  name: 'MoreArt_Mag_Studio',
  title: 'MoreArt Mag Studio',
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure,
    }),
    visionTool()
  ],

  schema: {
    types: schema.types,
    // On cache les singletons du menu "Nouveau document"
    templates: (prev) =>
      prev.filter((template) => !['settings', 'about'].includes(template.id)),
  },

  document: {
    // Pour les singletons, on cache l'action "dupliquer" et "supprimer"
    actions: (prev, { schemaType }) => {
      if (['settings', 'about'].includes(schemaType)) {
        return prev.filter(({ action }) => !['unpublish', 'delete', 'duplicate'].includes(action!))
      }
      return prev
    },
  },
})
