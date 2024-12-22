import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import pool from '../config/db.js';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(process.cwd(), './config/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './config/config.json');


export async function loadSavedCreadentialsIfExists() {
  try {

    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);

  } catch (err) {
    return null;
  }
}

export async function saveCreantials(credentials) {
  try {

    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;

    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: credentials.refresh_token
    });


    await fs.writeFile(TOKEN_PATH, payload);
    console.log('Token stored to', TOKEN_PATH);
  } catch (err) {
    console.error('Error saving credentials:', err);
    throw err;
  }
}

export async function authorize() {
  try {
    
    let client = await loadSavedCreadentialsIfExists();
    if(client) {    
      return client;
    }

    client = await authenticate({ 
      scopes: SCOPES ,
      keyfilePath: CREDENTIALS_PATH
    });

    if(client.credentials) {
      await saveCreantials(client);
    }

    return client;

  } catch (err) {
    console.error('Error authorizing:', err);
    throw err;
  }
}
