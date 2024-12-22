import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const TOKEN_PATH = path.join(process.cwd(), 'config', 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'config', 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

export async function createMeeting({ startDateTime, endDateTime, summary = 'Interview Meeting' }) {
  const authClient = await authorize();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const event = {
    summary,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Kolkata',
    },
    conferenceData: {
      createRequest: {
        requestId: `interview-${Date.now()}`,
        conferenceSolutionKey: { 
          type: 'hangoutsMeet'
        }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    resource: event
  });

  return {
    success: true,
    meetingId: response.data.id,
    joinUrl: response.data.hangoutLink,
    startTime: response.data.start.dateTime,
    endTime: response.data.end.dateTime
  };
}