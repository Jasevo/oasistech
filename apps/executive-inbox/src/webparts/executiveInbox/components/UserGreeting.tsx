import * as React from 'react';
import styles from './ExecutiveInbox.module.scss';
import { Persona, PersonaSize } from '@fluentui/react';

interface IUserGreetingProps {
  displayName: string;
}

export const UserGreeting: React.FC<IUserGreetingProps> = ({ displayName }) => {
  return (
    <div className={styles.header}>
      <Persona
        text={displayName}
        size={PersonaSize.size40}
        hidePersonaDetails
      />
      <div>
        <div className={styles.greeting}>Welcome, {displayName}</div>
        <div className={styles.subtitle}>Your latest emails</div>
      </div>
    </div>
  );
};
