import { MSGraphClientV3 } from '@microsoft/sp-http';
import { IEmail } from '../models/IEmail';

export class GraphService {
  private client: MSGraphClientV3;

  constructor(client: MSGraphClientV3) {
    this.client = client;
  }

  public async getRecentEmails(count: number = 5): Promise<IEmail[]> {
    const response = await this.client
      .api('/me/messages')
      .top(count)
      .select('id,subject,from,receivedDateTime,bodyPreview,isRead')
      .orderby('receivedDateTime desc')
      .get();
    return response.value;
  }

  public async getUserProfile(): Promise<{ displayName: string; mail: string }> {
    return this.client.api('/me').select('displayName,mail').get();
  }
}
