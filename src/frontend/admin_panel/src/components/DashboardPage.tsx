import React from "react";
import toast from "react-hot-toast";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme

import "./dashboardPage.css";
import SECRETS from "../lib/config";
import { getIdToken, signOut } from "../lib/utils/auth/authTools";
import { MongoTools } from "../lib/utils/db/mongoTools";

export default function DashboardPage() {
  const [userTbData, SETuserTbData] = React.useState([{}]);
  const [codeTbData, SETcodeTbData] = React.useState([{}]);
  const [formValue, SETformValue] = React.useState("");
  const [formKey, SETformKey] = React.useState("");
  const [codeFormVal, SETcodeFormVal] = React.useState("");
  const [deleteAll, SETdeleteAll] = React.useState(false);

  const mongoTools = new MongoTools();

  const rerender = function () {
    //I promise ill find a better way later... useReducer isnt working

    window.location.reload();
  };

  const updateUserTbData = function (doRerender = false) {
    mongoTools.collection("users").then(async (res) => {
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

      SETuserTbData(mergedArr);

      doRerender ? rerender() : null;
    });
  };

  const updateCodeTbData = function (doRerender = false) {
    mongoTools.collection("settings").then((res) => {
      console.log(res);
      SETcodeTbData(res);

      doRerender ? rerender() : null;
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
      updateUserTbData();
      updateCodeTbData();
    } catch (err) {
      console.warn(err);
    }
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
      mongoTools
        .pushData({ key: formKey, value: formValue }, "settings")
        .then(() => {
          updateCodeTbData(true);
        });
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

  const handleCodeDelete = function (e: React.FormEvent) {
    e.preventDefault();

    if (deleteAll) {
      mongoTools.delete({}, true, "settings");
      toast.success("Deleted all codes");
    } else {
      mongoTools.delete({ value: codeFormVal }, false, "settings");
      toast.success(`Deleted ${codeFormVal}`);
    }

    updateCodeTbData(true);
  };

  return (
    <section className="main">
      <section className="table_data">
        <div
          className={"ag-theme-alpine-dark"}
          style={{ width: "100%", height: "30rem", maxHeight: "40rem" }}>
          <AgGridReact
            rowData={userTbData}
            columnDefs={SECRETS.USER_TABLE_DEFS as any}
          />
        </div>
        <div
          className={"ag-theme-alpine-dark"}
          style={{
            width: "100%",
            height: "30rem",
            maxHeight: "40rem",
            maxWidth: "27rem"
          }}>
          <AgGridReact
            rowData={codeTbData}
            columnDefs={SECRETS.CODE_TABLE_DEFS as any}
          />
        </div>
      </section>
      <section className="container_actions">
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
        <section className="container_keyGen">
          <form onSubmit={handleCodeDelete} data-codeEdit>
            <input
              type="text"
              placeholder="VALUE"
              className="formInput"
              value={codeFormVal}
              onChange={(e) => SETcodeFormVal(e.target.value)}
              required
            />
            <p>Delete All?</p>
            <input
              type="checkbox"
              name="manyBox"
              placeholder="Many"
              onChange={() => SETdeleteAll(!deleteAll)}
              data-checkbox
            />
            <button data-submit>Delete</button>
          </form>
        </section>
      </section>
    </section>
  );
}
