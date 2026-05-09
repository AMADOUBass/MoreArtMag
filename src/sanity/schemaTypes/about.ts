import { defineType, defineField } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'À Propos (Bio)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom d\'artiste',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Ex: "Le Poète Oculaire"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortBio',
      title: 'Biographie courte',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artistStatement',
      title: 'Démarche artistique',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'exhibitions',
      title: 'Expositions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Année', type: 'number' },
            { name: 'title', title: 'Titre', type: 'string' },
            { name: 'location', title: 'Lieu', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'distinctions',
      title: 'Distinctions & Résidences',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Année', type: 'number' },
            { name: 'title', title: 'Titre', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'manifesto',
      title: 'Manifeste (Citation)',
      type: 'text',
      rows: 3,
    }),
  ],
})
