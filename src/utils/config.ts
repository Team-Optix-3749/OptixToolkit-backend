const isDEVELOPMENT = true;

const firebaseJson = isDEVELOPMENT ? require("./FIREBASE_JSON.json") : null;

export const firebaseConfig = isDEVELOPMENT
  ? {
      apiKey: "AIzaSyDI04e7u2jaeyjvjZTZCyits0KeMI6KKIk",
      authDomain: "garageopener-27000.firebaseapp.com",
      databaseURL: "https://garageopener-27000-default-rtdb.firebaseio.com",
      projectId: "garageopener-27000",
      storageBucket: "garageopener-27000.appspot.com",
      messagingSenderId: "1066651715164",
      appId: "1:1066651715164:web:b16a994346ad5fc20e8899",
      measurementId: "G-YSQX2FQCZX"
    }
  : {
      apiKey: "AIzaSyBywkBF8HlaLDTgvPM2bxCGXaBuhs8__7I",
      authDomain: "optixtoolkit.firebaseapp.com",
      databaseURL: "https://optixtoolkit.firebaseio.com",
      projectId: "optixtoolkit",
      storageBucket: "optixtoolkit.appspot.com",
      messagingSenderId: "227710522821",
      appId: "1:227710522821:web:8992302e340bb9c1b767ac",
      measurementId: "G-0M4XPGFFXM"
    };

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
