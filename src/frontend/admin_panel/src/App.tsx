import { useEffect, useState } from "react";

// import { type_dbDataSetState } from "./lib/types";
import "./App.css";

export default function App() {
  useEffect(() => {

    //authenticating user
    (async () => {
      try {

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
