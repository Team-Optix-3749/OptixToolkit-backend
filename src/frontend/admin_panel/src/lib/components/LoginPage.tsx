import React from "react";
import toast from "react-hot-toast";

import "./LoginPage.css";
import { isValidated, validateUser } from "../utils/auth/authTools";
import { validationState } from "../types";
import { SignInForm } from "./SignInForm";

export default function LoginPage({
  SETvalidated
}: {
  SETvalidated: React.Dispatch<React.SetStateAction<validationState>>;
}) {
  const [validateReqAllowed, SETvalidateReqAllowed] = React.useState(true);
  const [loginState, SETloginState] = React.useState({
    email: "",
    password: ""
  });

  React.useEffect(() => {
    isValidated().then((validated) => {
      if (validated) {
        validateUser().then((res) => {
          (globalThis as any).background_validate = res[1];
        });

        SETvalidated(true);
      }
    });
  }, []);

  const handleGoogleLogin = async function (email?: string, pass?: string) {
    SETvalidateReqAllowed(false);
    setTimeout(() => {
      SETvalidateReqAllowed(true);
    }, 10000);

    if (!validateReqAllowed) {
      toast.error("Please wait 10 seconds before trying again.", {
        duration: 1500
      });

      return;
    }

    const toast_validatingUser = toast.loading("Validating...");
    const [isValid, validateBackground, err] = await validateUser(email, pass);
    toast.dismiss(toast_validatingUser);

    switch (true) {
      case isValid === true: {
        SETvalidated(isValid);

        toast.success("Successfully logged in!");
        break;
      }

      case isValid === false: {
        SETvalidated(isValid);

        toast.error("You are not an Admin!");
        break;
      }

      case validateBackground != null && !err: {
        SETvalidated(true);
        (globalThis as any).background_validate = validateBackground;

        toast.success("Successfully logged in!");
        break;
      }

      case err != null: {
        SETvalidated("error");

        console.warn(err);

        toast.error("Error when validating");
        toast.error("Please refresh the page");
        break;
      }

      default: {
        SETvalidated("error");

        console.warn(err);

        toast.error("Something went wrong...");
        toast.error("Please refresh the page");
        break;
      }
    }
  };

  const handleSubmit = async function (evt: React.FormEvent) {
    evt.preventDefault();
    const validateEmail = function (email: string) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (!validateEmail(loginState.email) && loginState.email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success(`Signing in ${loginState.email}`);

    handleGoogleLogin(loginState.email, loginState.password);

    SETloginState({ email: "", password: "" });
  };

  return (
    <main>
      <SignInForm
        {...{ loginState, SETloginState, handleSubmit, handleGoogleLogin }}
      />
    </main>
  );
}
