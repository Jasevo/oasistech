import type { CollectionConfig } from 'payload'

export const ActivityLogs: CollectionConfig = {
  slug: 'activity-logs',
  admin: {
    useAsTitle: 'action',
    description: 'Audit trail of all task and project changes.',
    defaultColumns: ['collection', 'documentTitle', 'action', 'actor', 'createdAt'],
  },
  access: {
    create: () => true,           // written by hooks (overrideAccess)
    read: ({ req: { user } }) => Boolean(user),
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'collection',
      type: 'select',
      required: true,
      options: [
        { label: 'Task', value: 'tasks' },
        { label: 'Project', value: 'projects' },
      ],
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
    },
    {
      name: 'documentTitle',
      type: 'text',
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Created', value: 'created' },
        { label: 'Updated', value: 'updated' },
        { label: 'Deleted', value: 'deleted' },
      ],
    },
    {
      name: 'actor',
      type: 'text',
      defaultValue: 'Admin',
    },
    {
      name: 'changes',
      type: 'json',
      admin: {
        description: 'Array of { field, from, to } objects describing what changed.',
      },
    },
  ],
  timestamps: true,
}
