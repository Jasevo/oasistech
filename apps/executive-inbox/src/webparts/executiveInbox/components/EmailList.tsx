import * as React from 'react';
import styles from './ExecutiveInbox.module.scss';
import { IEmail } from '../models/IEmail';
import { EmailItem } from './EmailItem';

interface IEmailListProps {
  emails: IEmail[];
}

export const EmailList: React.FC<IEmailListProps> = ({ emails }) => {
  return (
    <ul className={styles.emailList}>
      {emails.map((email) => (
        <EmailItem key={email.id} email={email} />
      ))}
    </ul>
  );
};
