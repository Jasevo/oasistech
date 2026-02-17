import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webparts-base';
import { MSGraphClientV3 } from '@microsoft/sp-http';

import ExecutiveInbox from './components/ExecutiveInbox';
import { IExecutiveInboxProps } from './models/IExecutiveInboxProps';

export interface IExecutiveInboxWebPartProps {
  description: string;
}

export default class ExecutiveInboxWebPart extends BaseClientSideWebPart<IExecutiveInboxWebPartProps> {
  private _graphClient!: MSGraphClientV3;

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._graphClient = await this.context.msGraphClientFactory.getClient('3');
  }

  public render(): void {
    const element: React.ReactElement<IExecutiveInboxProps> = React.createElement(
      ExecutiveInbox,
      {
        graphClient: this._graphClient,
        userDisplayName: this.context.pageContext.user.displayName,
        isDarkTheme: this._isDarkTheme(),
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
      }
    );
    ReactDom.render(element, this.domElement);
  }

  private _isDarkTheme(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).__themeState__?.theme?.isInverted;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Executive Inbox Settings' },
          groups: [
            {
              groupName: 'Configuration',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
