import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Cookie from "js-cookie";

import { firebaseApp } from "../db/dbTools";
import * as SECRETS from "../secrets";

const authProvider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

auth.useDeviceLanguage();
authProvider.setCustomParameters({
  login_hint: "user@example.com"
});

export async function displayLoginModal() {
  try {
    const user = await signInWithPopup(auth, authProvider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      // getAdditionalUserInfo(result);
    
      return user;
    });

    return user
  } catch (err: any) {
    const errorCode = err.code;
    const errorMessage = err.message;
    const email = err.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(err);

    console.warn(
      "ERROR AUTHENTICATING:" +
        {
          errorCode,
          errorMessage,
          email,
          credential
        }
    );
  }
}
