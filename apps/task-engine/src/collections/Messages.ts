import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'subject',
    description: 'Internal direct messages between users.',
    defaultColumns: ['from', 'to', 'subject', 'read', 'createdAt'],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'from',
      type: 'relationship',
      relationTo: 'api-users',
      hasMany: false,
      required: true,
    },
    {
      name: 'to',
      type: 'relationship',
      relationTo: 'api-users',
      hasMany: false,
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 5000,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'linkedTask',
      type: 'relationship',
      relationTo: 'tasks',
      hasMany: false,
      admin: {
        description: 'Optionally attach a task to this message.',
      },
    },
    {
      name: 'linkedProject',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: false,
      admin: {
        description: 'Optionally attach a project to this message.',
      },
    },
  ],
  timestamps: true,
}
