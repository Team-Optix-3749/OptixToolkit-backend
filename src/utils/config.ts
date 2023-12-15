// sample
// const firebaseJson = require("./FIREBASE_JSON.json");

if (
  process.env.VERCEL_ENV !== "production" &&
  process.env.VERCEL_ENV !== "preview"
) {
  require("dotenv").config();
}

console.log(process.env.MONGO_URL, process.env.WEBHOOK_SECRET);

export const {
  USER_SECRET,
  MONGO_URL,
  WEBHOOK_SECRET,
  SENDGRID_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  // FIREBASE_JSON
} = process.env

// sample
// {
//   USER_SECRET: "gamers",
//   MONGO_URL: "mongodb://127.0.0.1:27017/toolkit",
//   WEBHOOK_SECRET: "something",
//   SENDGRID_KEY: "",
//   FIREBASE_PROJECT_ID: firebaseJson.project_id,
//   FIREBASE_CLIENT_EMAIL: firebaseJson.client_email,
//   FIREBASE_PRIVATE_KEY: firebaseJson.private_key,
//   FIREBASE_JSON: firebaseJson
// };
export const PORT = process.env.PORT ?? 4000;
