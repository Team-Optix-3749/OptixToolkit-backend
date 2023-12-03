import { SetStateAction, useEffect, useState, Dispatch } from "react";
import Cookie from "js-cookie";

import "./App.css";
import { validateUser } from "./lib/utils/auth/authTools";
import { isValidated } from "./lib/types";
import { initializeApp } from "firebase/app";

const SECRETS = import.meta.env;
/* 
  validate user

  user will then be redirected from <Loading /> to <Main /> if they 
  have admin credentials otherwise to some error page.

  <Homepage /> will contain ways to input a name, hours and an optional meeting count
  when submitted, meeting count will be incremented and everything else...

  this will also contain a way to add 'admin' role to more people
*/

export default function App() {
  const [validated, SETvalidated] = useState<isValidated>("false");

  useEffect(() => {
    //authenticating user
  }, []);

  switch (validated) {
    case "true":
      return <HomePage />;
    case "false":
      return <LoginPage {...{ SETvalidated }} />;
    case "notAuthorized":
      return <NotAuthorizedPage />;
    case "error":
      return <ErrorPage />;
  }
}

function LoginPage({
  SETvalidated
}: {
  SETvalidated: Dispatch<SetStateAction<isValidated>>;
}) {
  const handleLogin = async function () {
    await validateUser().then((result) => {
      if (result == true) {
        SETvalidated("true");
      } else if (result == false) {
        SETvalidated("notAuthorized");
      } else {
        SETvalidated("error");
      }
    });
  };

  return <button onClick={handleLogin}>Login</button>;
}

function HomePage() {
  //check if user is logged in in the background... if not remove auth cookie and redirect

  return <h1>hello</h1>;
}

function ErrorPage() {
  return <h1>Something went wrong ... refresh the page</h1>;
}

function NotAuthorizedPage() {
  return <h1>you are not an admin</h1>;
}
