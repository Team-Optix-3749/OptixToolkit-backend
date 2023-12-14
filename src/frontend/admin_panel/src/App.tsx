import React from "react";

import { validationState } from "./lib/types";
import LoginPage from "./lib/components/LoginPage";
import HomePage from "./lib/components/DashboardPage";
import { isValidated, validateUser } from "./lib/utils/auth/authTools";

/* 
  validate user

  user will then be redirected from <Loading /> to <Main /> if they 
  have admin credentials otherwise to some error page.

  <Homepage /> will contain ways to input a name, hours and an optional meeting count
  when submitted, meeting count will be incremented and everything else...

  this will also contain a way to add 'admin' role to more people
*/

export default function App() {
  const [validated, SETvalidated] = React.useState<validationState>(false);

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

  switch (validated) {
    case true:
      return <HomePage />;
    case false:
      return <LoginPage {...{ SETvalidated }} />;
    case "notAuthorized":
      return <NotAuthorizedPage />;
    case "error":
      return <ErrorPage />;
  }
}

function ErrorPage() {
  return <h1>Something went wrong ... refresh the page</h1>;
}

function NotAuthorizedPage() {
  return <h1>you are not an admin</h1>;
}
