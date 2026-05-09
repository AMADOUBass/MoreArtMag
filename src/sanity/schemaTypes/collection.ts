import { defineType, defineField } from 'sanity'

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de la collection',
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
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'longText',
      title: 'Texte détaillé',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'continent',
      title: 'Continent principal',
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
      name: 'year',
      title: 'Année principale',
      type: 'number',
    }),
    defineField({
      name: 'featured',
      title: 'Mise en avant',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
