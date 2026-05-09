import { defineType, defineField } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Configuration Globale',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      initialValue: 'MoreArt Mag',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contact',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux Sociaux',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Plateforme', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    }),
    defineField({
      name: 'newsletterText',
      title: 'Texte Newsletter',
      type: 'text',
      rows: 2,
      description: 'Texte court d\'incitation sous le titre de la newsletter.',
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Copyright Footer',
      type: 'string',
      initialValue: '© 2026 MOREART MAG — TOUS DROITS RÉSERVÉS.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Global',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Titre par défaut', type: 'string' },
        { name: 'metaDescription', title: 'Description par défaut', type: 'text', rows: 3 },
        { name: 'ogImage', title: 'Image de partage (OG)', type: 'image' },
      ],
    }),
  ],
})
