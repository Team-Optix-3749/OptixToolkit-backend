import React from "react";

import { type_userAuth } from "./lib/types";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/DashboardPage";
import { isValidated, validateUser } from "./lib/utils/auth/authTools";

export default function App() {
  const [validated, SETvalidated] = React.useState<type_userAuth>(false);

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
  return (
    <h1 style={{ color: "white" }}>
      Something went wrong ... refresh the page
    </h1>
  );
}

function NotAuthorizedPage() {
  return <h1 style={{ color: "white" }}>you are not an admin</h1>;
}
