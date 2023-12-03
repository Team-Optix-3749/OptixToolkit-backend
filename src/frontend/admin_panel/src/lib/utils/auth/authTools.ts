import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithPopup
} from "firebase/auth";
import Cookie from "js-cookie";

import { firebaseApp } from "../firebase";

const SECRETS = import.meta.env;

const authProvider = new GoogleAuthProvider();
let firebaseAuth: Auth;

/*
  If we want to save sign in state then change to browserLocalPersistence
*/

export async function validateUser() {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp);
    setPersistence(firebaseAuth, browserSessionPersistence);

    firebaseAuth.useDeviceLanguage();
    authProvider.setCustomParameters({
      login_hint: "user@example.com"
    });
  }

  const handleSignIn = async function (result: UserCredential) {
    // GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;

    const isAdmin = await fetch(`${SECRETS.VITE_BACKEND_URL}/auth`, {
      method: "POST",
      body: JSON.stringify({
        endpoint: "authorize",
        payload: {
          token: user.getIdToken(),
          type: "admin"
        }
      })
    })
      .then((res) => res.json())
      .then();

    console.log("isAdmin", isAdmin);

    return isAdmin;
  };

  try {
    //signInWithPopup || signInWithRedirect

    const user = await signInWithPopup(firebaseAuth, authProvider).then(
      handleSignIn
    );

    return user;
  } catch (err: any) {
    console.warn("AUTH ERROR:" + err);
  }
}
