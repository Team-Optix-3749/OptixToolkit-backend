import * as admin from "firebase-admin";
import firebase from "@firebase/app";
import "@firebase/auth";

import { Request, Response } from "express";

import {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CONFIG
} from "./config";

const adminApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  })
});
firebase.initializeApp(FIREBASE_CONFIG);

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
  return admin.auth().deleteUser((await admin.auth().getUserByEmail(uid)).uid);
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

    console.log(e);
  }

  if (isAdmin) {
    await admin
      .auth()
      .setCustomUserClaims(user.uid, { admin: true, member: true });
  } else {
    await admin.auth().setCustomUserClaims(user.uid, { member: true });
  }

  console.log("Create User ", user.email);
  return await firebase.auth().sendPasswordResetEmail(user.email);
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

export async function get_user_data(req, res) {
  const userUID = req.body.uid;

  if (!userUID) res.status(400);

  try {
    const {
      uid,
      email,
      emailVerified,
      phoneNumber,
      photoURL,
      customClaims,
      displayName
    } = await admin.auth().getUser(userUID);

    res.json({
      uid,
      email,
      emailVerified,
      phoneNumber,
      photoURL,
      customClaims,
      displayName
    });
  } catch {
    res.status(500).json("Error");
  }
}
