import { cookies } from "next/headers";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

import { baseFetchURL, firebaseConfig } from "./config";
import { createSession } from "./session";

export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const firebaseAuth = getAuth(firebaseApp);
export const provider = new GoogleAuthProvider();

setPersistence(firebaseAuth, browserLocalPersistence);

type userOptions = "user" | "admin" | "certified";
async function authorizeUser(userToken: string, type: userOptions) {
  let res: any = false;

  try {
    res = await fetch(baseFetchURL + "/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        endpoint: "authorize",
        payload: {
          token: userToken,
          type
        }
      })
    }).then((res) => res.json());
  } catch (err) {
    console.warn(err);
  }

  switch (true) {
    case res === true:
      createSession();
      return AuthStates.AUTHORIZED;
    case res === false:
      return AuthStates.UNAUTHORIZED;
    default:
      return AuthStates.ERROR;
  }
}

export async function signIn_emailPass(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  const userIdToken = await user.getIdToken();

  return authorizeUser(userIdToken, "admin");
}

export async function signIn_google() {
  const { user } = await signInWithPopup(firebaseAuth, provider);

  const userIdToken = await user.getIdToken();

  return authorizeUser(userIdToken, "admin");
}

export function getCurrentUser() {
  return firebaseAuth.currentUser;
}

export enum AuthStates {
  AUTHORIZED,
  UNAUTHORIZED,
  UNKNOWN,
  ERROR
}
