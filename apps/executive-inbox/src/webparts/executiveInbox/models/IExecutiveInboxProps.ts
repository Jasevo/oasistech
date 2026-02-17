import { MSGraphClientV3 } from '@microsoft/sp-http';

export interface IExecutiveInboxProps {
  graphClient: MSGraphClientV3;
  userDisplayName: string;
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
}
