import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import styles from './ExecutiveInbox.module.scss';
import { IExecutiveInboxProps } from '../models/IExecutiveInboxProps';
import { IEmail } from '../models/IEmail';
import { GraphService } from '../services/GraphService';
import { EmailList } from './EmailList';
import { UserGreeting } from './UserGreeting';
import { Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react';

const ExecutiveInbox: React.FC<IExecutiveInboxProps> = (props) => {
  const { graphClient, userDisplayName } = props;
  const [emails, setEmails] = useState<IEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const service = new GraphService(graphClient);
      const result = await service.getRecentEmails(5);
      setEmails(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch emails';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [graphClient]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return (
    <section className={styles.executiveInbox}>
      <UserGreeting displayName={userDisplayName} />

      {loading && (
        <div className={styles.loadingContainer}>
          <Spinner size={SpinnerSize.large} label="Loading your inbox..." />
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            dismissButtonAriaLabel="Close"
          >
            {error}
          </MessageBar>
        </div>
      )}

      {!loading && !error && emails.length === 0 && (
        <div className={styles.emptyState}>
          <p>Your inbox is empty. No recent emails found.</p>
        </div>
      )}

      {!loading && !error && emails.length > 0 && (
        <EmailList emails={emails} />
      )}
    </section>
  );
};

export default ExecutiveInbox;
