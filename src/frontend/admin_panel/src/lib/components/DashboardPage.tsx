import React from "react";
import toast from "react-hot-toast";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme

import "./dashboardPage.css";
import SECRETS from "../secrets";
import { getIdToken, signOut } from "../utils/auth/authTools";
import { MongoDBCollection } from "../utils/db/mongoCol";

export default function DashboardPage() {
  const [tbData, SETtbData] = React.useState([{}]);
  const [formValue, SETformValue] = React.useState("");
  const [formKey, SETformKey] = React.useState("");

  const usersCol = new MongoDBCollection("users");
  const settingsCol = new MongoDBCollection("settings");

  const updateTbData = function () {
    usersCol.collection().then(async (res) => {
      res.forEach((userObj: any) => {
        userObj.hours = (userObj.seconds / 1000 / 60 / 60).toPrecision(3);
      });

      const { users } = await fetch(`${SECRETS.BACKEND_URL}/`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          auth: await getIdToken(),
          endpoint: `list-users`
        })
      }).then((apiRes) => apiRes.json());

      const mergedArr = res.map((resItem: any) => {
        const foundItem = users.find((item: any) => item.uid === resItem.uid);
        return { ...resItem, ...foundItem };
      });

      console.log(mergedArr);

      SETtbData(mergedArr);
    });
  };

  React.useEffect(() => {
    const background_validateTask = (globalThis as any).background_validate;
    if (background_validateTask) {
      background_validateTask().then((isValid: boolean) => {
        if (!isValid) {
          toast.error("You are not authorized. Please relogin");
          signOut();
          window.location.reload();
        }
      });
    }

    try {
      updateTbData();
    } catch (err) {
      console.warn(err);
    }

    setInterval(() => {
      updateTbData();
    }, 120000);
  }, []);

  const generateRandomKey = function (length: number) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let finalKey = "";

    for (let i = 0; i < length; i++) {
      finalKey += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    return finalKey.toLowerCase();
  };

  const handleSubmit = function (e: React.FormEvent) {
    e.preventDefault();

    if (
      !["checkInPassword", "checkOutPassword", "attendanceOverride"].includes(
        formKey
      )
    ) {
      SETformKey("");
      toast.error("Invalid Key, use:");

      toast("checkInPassword");
      toast("checkOutPassword");
      toast("attendanceOverride");

      return;
    }
    try {
      settingsCol.pushData({ key: formKey, value: formValue });
    } catch (err) {
      console.warn(err);

      toast.error("Something went wrong.");
      toast("Please refresh page and try again");

      return;
    }

    toast.success(`Created ${formKey} key: ${formValue}`);

    SETformKey("");
    SETformValue("");

    return;
  };

  return (
    <section className="main">
      <section className="table_data">
        <div
          className={"ag-theme-alpine-dark"}
          style={{ width: "100%", height: "30rem", maxHeight: "40rem" }}>
          <AgGridReact
            rowData={tbData}
            columnDefs={SECRETS.TABLE_DEFS as any}
          />
        </div>
      </section>
      <section className="container_keyGen">
        <form onSubmit={handleSubmit} data-keyGen>
          <input
            type="text"
            placeholder="KEY"
            className="formInput"
            value={formKey}
            onChange={(e) => SETformKey(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="VALUE"
            className="formInput"
            value={formValue}
            onChange={(e) => SETformValue(e.target.value)}
            required
          />
          <button data-submit>Create</button>
        </form>
        <button
          className="randomValueGen"
          onClick={() => {
            SETformValue(generateRandomKey(5));
          }}>
          Generate Random
        </button>
      </section>
      <button>hello</button>
    </section>
  );
}
