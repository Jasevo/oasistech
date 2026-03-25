import type { CollectionConfig } from 'payload'

export const SiteVisits: CollectionConfig = {
  slug: 'site-visits',
  admin: {
    useAsTitle: 'page',
    description: 'Tracks visitor activity across the site.',
    defaultColumns: ['page', 'ipAddress', 'device', 'browser', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'page',
      type: 'text',
      required: true,
    },
    {
      name: 'ipAddress',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'browser',
      type: 'text',
    },
    {
      name: 'os',
      type: 'text',
    },
    {
      name: 'device',
      type: 'select',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Unknown', value: 'unknown' },
      ],
      defaultValue: 'unknown',
    },
    {
      name: 'referrer',
      type: 'text',
    },
    {
      name: 'userAgent',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
