import { SetStateAction, useEffect, useState, Dispatch } from "react";
import Cookie from "js-cookie";

import "./App.css";
import * as SECRETS from "./lib/secrets";
import { displayLoginModal } from "./lib/auth/authTools";
import { getAdminUsers } from "./lib/db/dbTools";

/* 
  validate user

  user will then be redirected from <Loading /> to <Main /> if they 
  have admin credentials otherwise to some error page.

  <Homepage /> will contain ways to input a name, hours and an optional meeting count
  when submitted, meeting count will be incremented and everything else...

  this will also contain a way to add 'admin' role to more people
*/

export default function App() {
  const [validated, SETvalidated] = useState(false);

  useEffect(() => {
    //authenticating user
    const authorized = Cookie.get("authorized") === "true" ? true : false;

    SETvalidated(authorized);
  }, []);

  return validated ? <Homepage /> : <Login {...{ SETvalidated }} />;
}

function Login({
  SETvalidated
}: {
  SETvalidated: Dispatch<SetStateAction<boolean>>;
}) {
  const handleLogin = async function () {
    const user = await displayLoginModal();
    const admins = await getAdminUsers();

    if (admins.includes(user?.uid as string)) {
      Cookie.set("authenticated", "true", { expires: 1 });
      SETvalidated(true);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}

function Homepage() {
  //check if user is logged in ... if not remove auth cookie and redirect

  return <h1>hello</h1>;
}
