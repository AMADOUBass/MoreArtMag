import { defineType, defineField } from 'sanity'

export const artwork = defineType({
  name: 'artwork',
  title: 'Œuvre',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type d\'œuvre',
      type: 'string',
      options: {
        list: [
          { title: 'Photographie', value: 'photo' },
          { title: 'Peinture', value: 'peinture' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images supplémentaires',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'year',
      title: 'Année de création',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'location',
      title: 'Lieu',
      type: 'string',
      description: 'Lieu de prise de vue ou de création (ex: "Dakar, Sénégal")',
    }),
    defineField({
      name: 'continent',
      title: 'Continent',
      type: 'string',
      options: {
        list: [
          { title: 'Afrique', value: 'afrique' },
          { title: 'Europe', value: 'europe' },
          { title: 'Amérique', value: 'amerique' },
          { title: 'Asie', value: 'asie' },
          { title: 'Océanie', value: 'oceanie' },
          { title: 'Autre', value: 'autre' },
        ],
      },
    }),
    defineField({
      name: 'shortDescription',
      title: 'Description courte',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'longDescription',
      title: 'Description détaillée',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'availableInShop',
      title: 'Disponible en boutique',
      type: 'boolean',
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requiresQuote',
      title: 'Sur devis uniquement',
      type: 'boolean',
      description: 'Si activé, l\'achat direct est désactivé au profit d\'une demande de devis.',
      initialValue: false,
    }),
    defineField({
      name: 'sizes',
      title: 'Tailles disponibles',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'sizeId', title: 'ID de taille (unique)', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'label', title: 'Libellé (ex: 40x60 cm)', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'widthCm', title: 'Largeur (cm)', type: 'number', validation: Rule => Rule.required() }),
            defineField({ name: 'heightCm', title: 'Hauteur (cm)', type: 'number', validation: Rule => Rule.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Mise en avant',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'archived',
      title: 'Archivé',
      type: 'boolean',
      description: 'N\'apparaît pas dans la boutique mais reste dans la galerie.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'type',
    },
  },
})
