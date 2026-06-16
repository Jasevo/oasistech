import type { CollectionConfig } from 'payload'

export const TaskComments: CollectionConfig = {
  slug: 'task-comments',
  admin: {
    useAsTitle: 'body',
    description: 'Comments and notes on tasks.',
    defaultColumns: ['task', 'author', 'body', 'createdAt'],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      hasMany: false,
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'api-users',
      hasMany: false,
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      minLength: 1,
      maxLength: 2000,
    },
    {
      name: 'mentionedTask',
      type: 'relationship',
      relationTo: 'tasks',
      hasMany: false,
      admin: {
        description: 'Optional: link/mention another task in this comment.',
      },
    },
  ],
  timestamps: true,
}
