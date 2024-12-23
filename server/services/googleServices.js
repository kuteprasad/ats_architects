import { google } from "googleapis";
import { promises as fs } from "fs";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { SpacesServiceClient } from "@google-apps/meet";
import dotenv from "dotenv";

dotenv.config();

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/meetings.space.created",
  "https://mail.google.com/"
];

const TOKEN_PATH = path.join(process.cwd(), "./config/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "./config/credentials.json");

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials(credentials);
    return oauth2Client;
  } catch (err) {
    console.error("Error loading credentials:", err);
    return null;
  }
}

async function saveCredentials(client) {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  } catch (err) {
    console.error("Error saving credentials:", err);
    throw err;
  }
}

export async function authorize() {
      try {
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
      } catch (error) {
        console.error("Authorization failed:", error);
        throw error;
      }
    }

export const getGoogleServices = async () => {

  try {
    const authClient = await authorize();

    if (!authClient) {
      throw new Error("Authentication failed");
    }

    const calendar = google.calendar({
      version: "v3",
      auth: authClient,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: authClient,
    });

    const meetClient = new SpacesServiceClient({
      authClient: authClient,
    });

    return {
      gmail,
      calendar,
      meetClient,
    };
  } catch (error) {
    console.error("Error initializing Google services:", error);
    throw error;
  }
};