import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    description: 'Organize tasks into projects.',
    defaultColumns: ['name', 'status', 'color', 'createdAt'],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'color',
      type: 'select',
      required: true,
      defaultValue: 'blue',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Purple', value: 'purple' },
        { label: 'Orange', value: 'orange' },
        { label: 'Red', value: 'red' },
        { label: 'Teal', value: 'teal' },
        { label: 'Pink', value: 'pink' },
        { label: 'Yellow', value: 'yellow' },
      ],
    },
  ],
  timestamps: true,
}
