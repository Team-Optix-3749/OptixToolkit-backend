import { FirebaseApp, initializeApp } from "firebase/app";

import SECRETS from "../../config";

const firebaseConfig = SECRETS.FIREBASECFG;

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
