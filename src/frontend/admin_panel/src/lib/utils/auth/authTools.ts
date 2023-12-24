import {
  Auth,
  GoogleAuthProvider,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

import SECRETS from "../../config";
import { firebaseApp } from "../db/firebase";

const authProvider = new GoogleAuthProvider();
let firebaseAuth: Auth;

/*
  If we want to save sign in state then change to browserLocalPersistence
*/

export async function getIdToken() {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp);
    setPersistence(firebaseAuth, browserSessionPersistence);

    firebaseAuth.useDeviceLanguage();
    authProvider.setCustomParameters({
      login_hint: "user@example.com"
    });

    await firebaseAuth.authStateReady();
  }
  return firebaseAuth.currentUser?.getIdToken();
}

export async function validateUser(email?: string, pass?: string) {
  const userIdToken = await getIdToken();

  const handleSignIn = async function (token: Promise<string>) {
    const isAdmin = await fetch(`${SECRETS.BACKEND_URL}/api/auth`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        endpoint: "authorize",
        payload: {
          token: await token,
          type: "admin"
        }
      })
    }).then((res) => res.json());

    return isAdmin;
  };

  if (userIdToken) {
    return [null, () => handleSignIn(userIdToken as any), null];
  }

  let token;

  try {
    if (email && pass) {
      token = signInWithEmailAndPassword(firebaseAuth, email, pass).then(
        (userCred) => userCred.user?.getIdToken()
      );
    } else {
      token = signInWithPopup(firebaseAuth, authProvider).then(
        (userCred) => userCred.user?.getIdToken()
      );
    }

    const isAdmin = await handleSignIn(token);

    if (isAdmin != true) {
      firebaseAuth.currentUser?.delete();
    }

    return [isAdmin, null, null];
  } catch (err: any) {
    console.warn("AUTH ERROR: " + err);

    if (err.code == "auth/user-not-found") return ["notAuthorized", null, null];

    return [null, null, err];
  }
}

export async function task_setBackgroundValidate() { }

export async function isValidated() {
  return !!(await getIdToken());
}

export function signOut() {
  try {
    firebaseAuth.currentUser?.delete();
    firebaseAuth.signOut();
  } catch (error) {
    console.warn(error);
  }
}
