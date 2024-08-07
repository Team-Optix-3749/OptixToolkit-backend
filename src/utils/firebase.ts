import * as admin from "firebase-admin";
import firebase from "@firebase/app";
import "@firebase/auth";

import { Request, Response } from "express";

import {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY
} from "./config";

const adminApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  })
});

firebase.initializeApp({
  apiKey: "AIzaSyDI04e7u2jaeyjvjZTZCyits0KeMI6KKIk",
  authDomain: "garageopener-27000.firebaseapp.com",
  databaseURL: "https://garageopener-27000-default-rtdb.firebaseio.com",
  projectId: "garageopener-27000",
  storageBucket: "garageopener-27000.appspot.com",
  messagingSenderId: "1066651715164",
  appId: "1:1066651715164:web:b16a994346ad5fc20e8899",
  measurementId: "G-YSQX2FQCZX"
});

// firebase.initializeApp({
// 	apiKey: 'AIzaSyBywkBF8HlaLDTgvPM2bxCGXaBuhs8__7I',
// 	authDomain: 'optixtoolkit.firebaseapp.com',
// 	databaseURL: 'https://optixtoolkit.firebaseio.com',
// 	projectId: 'optixtoolkit',
// 	storageBucket: 'optixtoolkit.appspot.com',
// 	messagingSenderId: '227710522821',
// 	appId: '1:227710522821:web:8992302e340bb9c1b767ac',
// 	measurementId: 'G-0M4XPGFFXM',
// })
interface options {
  type: "admin" | "certified" | "user";
}

export async function authorize(
  token: string,
  options: options = { type: "user" }
) {
  if (token == undefined) return false;
  try {
    const user = await admin.auth(adminApp).verifyIdToken(token);

    if (!user.member) throw new Error("Invalid user!");
    if (!user.admin && options.type == "admin")
      throw new Error("User not Admin!");
    if (!user.certified && options.type == "certified")
      throw new Error("User not Certified!");
    return user;
  } catch (e) {
    return false;
  }
}

export async function removeUser(uid: string) {
  return admin.auth().deleteUser(uid);
}

export async function listUsers() {
  return admin.auth().listUsers();
}

export async function appendDisplayName(uid: string, object: any) {
  if (uid === undefined) {
    return {
      ...object,
      displayName: "None"
    };
  }
  try {
    return {
      ...object,
      displayName: (await admin.auth().getUser(uid)).displayName
    };
  } catch (e) {
    return {
      ...object,
      displayName: "None"
    };
  }
}

export async function getUserByUid(req: Request, res: Response) {
  const uid = req.body.payload.uid;

  const user = await admin.auth().getUser(uid);

  res.json(user);
}

export async function getDisplayName(uid: string) {
  if (uid === undefined) return "None";
  try {
    return (await admin.auth().getUser(uid)).displayName;
  } catch {
    return uid;
  }
}

export async function addUser(name: string, email: string, isAdmin: boolean) {
  let user: admin.auth.UserRecord;
  try {
    user = await admin.auth().createUser({
      email: email,
      displayName: name
    });
  } catch (e) {
    user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      email: user.email,
      displayName: name
    });
  }

  if (isAdmin) {
    await admin
      .auth()
      .setCustomUserClaims(user.uid, { admin: true, member: true });
  } else {
    await admin.auth().setCustomUserClaims(user.uid, { member: true });
  }

  return firebase.auth().sendPasswordResetEmail(email);
}

export async function certifyUser(uid: string) {
  const user = await admin.auth().getUser(uid);
  const currentClaims = user.customClaims;
  await admin
    .auth()
    .setCustomUserClaims(uid, { ...currentClaims, certified: true });
}

export async function uncertifyUser(uid: string) {
  const user = await admin.auth().getUser(uid);
  const currentClaims = user.customClaims;
  await admin
    .auth()
    .setCustomUserClaims(uid, { ...currentClaims, certified: false });
}

export async function authenticateUser(req: Request, res: Response) {
  const token = req.body.payload.token;
  const type = req.body.payload.type;

  if ((await authorize(token, { type })) === false) {
    res.status(200).json(false);
  } else if (await authorize(token, { type })) {
    res.status(200).json(true);
  }
}
