// import { google } from 'googleapis';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.send'];

// class GmailService {
//   async authorize() {
//     const auth = await google.auth.getClient({
//       keyFile: CREDENTIALS_PATH,
//       scopes: SCOPES
//     });
//     return google.gmail({ version: 'v1', auth });
//   }

//   async processEmail(messageId) {
//     const gmail = await this.authorize();
//     const message = await gmail.users.messages.get({
//       userId: 'me',
//       id: messageId,
//       format: 'full'
//     });

//     const attachments = await this.getAttachments(message.data);
//     const body = this.getEmailBody(message.data.payload);
//     const subject = this.getHeader(message.data.payload.headers, 'Subject');
//     const sender = this.getHeader(message.data.payload.headers, 'From');

//     return { subject, body, sender, attachments };
//   }

//   getHeader(headers, name) {
//     return headers.find(h => h.name === name)?.value;
//   }

//   async getAttachments(message) {
//     const attachments = [];
//     const parts = message.payload.parts || [];

//     for (const part of parts) {
//       if (part.filename && part.body.attachmentId) {
//         const attachment = await this.downloadAttachment(part.body.attachmentId);
//         attachments.push({
//           filename: part.filename,
//           data: attachment
//         });
//       }
//     }
//     return attachments;
//   }
// }

// export default GmailService();