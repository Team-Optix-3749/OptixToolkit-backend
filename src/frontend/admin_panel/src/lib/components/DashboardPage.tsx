import React from "react";
import toast from "react-hot-toast";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme

import "./dashboardPage.css";
import SECRETS from "../secrets";
import { signOut } from "../utils/auth/authTools";
import { MongoDBCollection } from "../utils/db/mongoCol";

export default function DashboardPage() {
  const [tbData, SETtbData] = React.useState([{}]);

  const usersCol = new MongoDBCollection("users");
  const settingsCol = new MongoDBCollection("settings");

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

    usersCol.collection().then((res) => {
      SETtbData(res);
    });
    settingsCol.collection().then((res) => console.log(res));

    setInterval(() => {
      usersCol.collection().then((res) => {
        SETtbData(res);
      });
    }, 120000);
  }, []);

  return (
    <section className="table_data">
      <div
        className={"ag-theme-alpine-dark"}
        style={{ width: "100%", height: "100%", maxHeight: "40rem" }}>
        <AgGridReact rowData={tbData} columnDefs={SECRETS.TABLE_DEFS as any} column/>
      </div>
    </section>
  );
}
