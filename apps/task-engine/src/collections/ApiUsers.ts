import type { CollectionConfig } from 'payload'

export const ApiUsers: CollectionConfig = {
  slug: 'api-users',
  auth: {
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
    description: 'Manages user accounts and API access credentials.',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'api-consumer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'API Consumer', value: 'api-consumer' },
      ],
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Optional display name for the user.',
      },
    },
  ],
  timestamps: true,
}
