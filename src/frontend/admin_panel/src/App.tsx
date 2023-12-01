import { useEffect, useState } from "react";

import "./App.css";
// import { type_dbDataSetState } from "./lib/types";
import { getValidUsers, main } from "./lib/db/dbTools";
import { validateLogin_string } from "./lib/auth/authTools";

const SECRETS = import.meta.env;

/* 
  I dont yet know how the firebase authentication will work 
  so I made validateLogin_string hoping that it will return a uid 
  and I can compare that to the list of uids from firebase

  user will then be redirected from <Loading /> to <Main /> if they 
  have admin credentials otherwise to some error page.

  <Main /> will contain ways to input a name, hours and an optional meeting count
  when submitted, meeting count will be incremented and everything else...

  this will also contain a way to add 'admin' role to more people
*/

export default function App() {
  useEffect(() => {
    //authenticating user

    (async () => {
      try {
        console.log(validateLogin_string("foo"));
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  return <Loading />;
}

function Loading() {
  return <h2>loading</h2>;
}

// function Homepage() {
//   const [loading, SETloading] = useState(true);
//   const [dbData, SETdbData] = useState({});

//   useEffect(() => {
//     (async () => {
//       await setTimeout(() => {
//         SETdbData({
//           uid: "rhgbeThIMBV86P15RgMkCHrxQgf1",
//           lastCheckIn: 0,
//           seconds: 14400000,
//           meetingCount: 3,
//           __v: 0
//         });
//       }, 200);
//     })();

//     SETloading(false);
//   }, []);

//   return <h1>hello</h1>;
// }
