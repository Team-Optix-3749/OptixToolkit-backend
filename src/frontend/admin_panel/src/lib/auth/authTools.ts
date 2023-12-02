import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Cookie from "js-cookie";

import { firebaseApp } from "../db/dbTools";
import * as SECRETS from "../secrets";

const authProvider = new GoogleAuthProvider();
const firebaseAuth = getAuth(firebaseApp);

firebaseAuth.useDeviceLanguage();
authProvider.setCustomParameters({
  login_hint: "user@example.com"
});

export async function validateUser() {
  try {
    const user = await signInWithPopup(firebaseAuth, authProvider).then(
      async (result) => {
        // GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        const uid = user.uid;

        //use an API here to get if user is admin or not
        const isAdmin = true;

        if (isAdmin) {
          Cookie.set("authenticated", "true", { expires: 1 });
        }

        return isAdmin;
      }
    );

    return user;
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
