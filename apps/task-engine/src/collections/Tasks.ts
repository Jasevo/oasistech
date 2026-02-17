import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    description: 'Task management for the Secure Task Engine.',
    defaultColumns: ['title', 'status', 'priority', 'project', 'dueDate', 'createdAt'],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 1,
      maxLength: 200,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'todo',
      options: [
        { label: 'To Do', value: 'todo' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'dueDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: false,
    },
  ],
  timestamps: true,
}
