// import { google } from 'googleapis';
// import pool from '../config/db.js';

// class GmailWatchService {
//   async setupWatch() {
//     const gmail = await this.authorize();
//     try {
//       const response = await gmail.users.watch({
//         userId: 'me',
//         requestBody: {
//           labelIds: ['INBOX'],
//           topicName: 'projects/your-project/topics/gmail-notifications'
//         }
//       });
      
//       // Store expiration
//       await pool.query(
//         'UPDATE "systemConfig" SET "watchExpiration" = $1',
//         [new Date(response.data.expiration)]
//       );

//       return response.data;
//     } catch (error) {
//       console.error('Watch setup failed:', error);
//       throw error;
//     }
//   }

//   async checkHistory(historyId) {
//     const gmail = await this.authorize();
//     try {
//       const response = await gmail.users.history.list({
//         userId: 'me',
//         startHistoryId: historyId
//       });

//       // Process any missed messages
//       for (const history of response.data.history || []) {
//         for (const message of history.messages || []) {
//           await processNewEmail(message.id);
//         }
//       }
//     } catch (error) {
//       console.error('History check failed:', error);
//       throw error;
//     }
//   }

//   // Run every 6 days (watch expires in 7 days)
//   async scheduleWatchRenewal() {
//     setInterval(async () => {
//       await this.setupWatch();
//     }, 6 * 24 * 60 * 60 * 1000);
//   }
// }

// export default GmailWatchService();