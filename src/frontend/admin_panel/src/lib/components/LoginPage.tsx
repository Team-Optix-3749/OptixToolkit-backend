import React, { SetStateAction } from "react";
import { validateUser } from "../utils/auth/authTools";
import { isValidated } from "../types";

import "./LoginPage.css";

export default function LoginPage({
  SETvalidated
}: {
  SETvalidated: React.Dispatch<SetStateAction<isValidated>>;
}) {
  const handleLogin = async function () {
    const [isValid, validateBackground, err] = await validateUser();

    if (isValid) {
      SETvalidated(isValid);
    } else if (!isValid && !err) {
      SETvalidated(true);
      (globalThis as any).background_validate = validateBackground;
    } else {
      SETvalidated("error");
    }
  };

  return (
    <button onClick={handleLogin} className="loginBtn">
      <img src="googleLogo.svg" alt="google logo" className="img_googleIcon" />
      Login with Google
    </button>
  );
}
