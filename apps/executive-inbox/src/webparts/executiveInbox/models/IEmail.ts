export interface IEmail {
  id: string;
  subject: string;
  bodyPreview: string;
  isRead: boolean;
  receivedDateTime: string;
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
}
