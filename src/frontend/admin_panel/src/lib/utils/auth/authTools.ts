import {
  Auth,
  GoogleAuthProvider,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

import { firebaseApp } from "../firebase";

const SECRETS = import.meta.env;

const authProvider = new GoogleAuthProvider();
let firebaseAuth: Auth;

/*
  If we want to save sign in state then change to browserLocalPersistence
*/

export async function validateUser(email?: string, pass?: string) {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp);
    setPersistence(firebaseAuth, browserSessionPersistence);

    firebaseAuth.useDeviceLanguage();
    authProvider.setCustomParameters({
      login_hint: "user@example.com"
    });

    await firebaseAuth.authStateReady();
    var userIdToken = firebaseAuth.currentUser?.getIdToken();
  }

  const handleSignIn = async function (token: Promise<string>) {
    const isAdmin = await fetch(`http://${SECRETS.VITE_BACKEND_URL}/auth`, {
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
    })
      .then((res) => res.json())
      .then();

    return isAdmin;
  };

  if (userIdToken) {
    return [null, () => handleSignIn(userIdToken as any), null];
  }

  try {
    if (email && pass) {
      var token = signInWithEmailAndPassword(firebaseAuth, email, pass).then(
        (userCred) => userCred.user?.getIdToken()
      );
    } else {
      var token = signInWithPopup(firebaseAuth, authProvider).then(
        (userCred) => userCred.user?.getIdToken()
      );
    }

    const isAdmin = await handleSignIn(token);

    if(isAdmin != true) {
      firebaseAuth.currentUser?.delete();
    }

    return [isAdmin, null, null];
  } catch (err: any) {
    console.warn("AUTH ERROR:" + err);

    return [null, null, err];
  }
}

export function signOut() {
  try {
    firebaseAuth.currentUser?.delete();
    firebaseAuth.signOut();
  } catch (error) {
    console.warn(error);
  }
}
