const fs = require("fs");

let firebaseJson: any = null;

if (fs.existsSync("./FIREBASE_JSON.json")) {
  firebaseJson = require("./FIREBASE_JSON.json");
}

if (
  process.env.VERCEL_ENV !== "production" &&
  process.env.VERCEL_ENV !== "preview"
) {
  require("dotenv").config();
}

console.log(process.env.MONGO_URL, process.env.WEBHOOK_SECRET);

const isDEVELOPMENT = !!firebaseJson;

export const {
  USER_SECRET,
  MONGO_URL,
  WEBHOOK_SECRET,
  SENDGRID_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY
} = isDEVELOPMENT
  ? {
      USER_SECRET: "gamers",
      MONGO_URL: "mongodb://127.0.0.1:27017/toolkit",
      WEBHOOK_SECRET: "",
      SENDGRID_KEY: "",
      FIREBASE_PROJECT_ID: firebaseJson.project_id,
      FIREBASE_CLIENT_EMAIL: firebaseJson.client_email,
      FIREBASE_PRIVATE_KEY: firebaseJson.private_key
    }
  : process.env;

export const PORT = process.env.PORT ?? 4000;
