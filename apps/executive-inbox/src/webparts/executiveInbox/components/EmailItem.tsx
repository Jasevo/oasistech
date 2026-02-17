import * as React from 'react';
import styles from './ExecutiveInbox.module.scss';
import { IEmail } from '../models/IEmail';
import { Icon } from '@fluentui/react';

interface IEmailItemProps {
  email: IEmail;
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const EmailItem: React.FC<IEmailItemProps> = ({ email }) => {
  const itemClass = email.isRead ? styles.emailItem : styles.emailItemUnread;

  return (
    <li className={itemClass}>
      <div className={styles.emailHeader}>
        <span className={styles.emailSender}>
          <Icon iconName={email.isRead ? 'Read' : 'Mail'} style={{ marginRight: 6 }} />
          {email.from.emailAddress.name}
        </span>
        <span className={styles.emailDate}>
          {formatRelativeDate(email.receivedDateTime)}
        </span>
      </div>
      <div className={styles.emailSubject}>{email.subject}</div>
      <div className={styles.emailPreview}>{email.bodyPreview}</div>
    </li>
  );
};
