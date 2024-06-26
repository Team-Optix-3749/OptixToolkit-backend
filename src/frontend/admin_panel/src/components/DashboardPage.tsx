import React from "react";
import toast from "react-hot-toast";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme

import "./dashboardPage.css";
import SECRETS from "../lib/config";
import { getUserIdToken, signOut } from "../lib/utils/auth/authTools";
import { MongoTools } from "../lib/utils/db/mongoTools";
import { type_codeData } from "../lib/types";

export default function DashboardPage() {
  const [userTbData, SETuserTbData] = React.useState([{}]);
  const [codeTbData, SETcodeTbData] = React.useState<type_codeData[]>();
  const [codesDropdown, SETcodesDropdown] = React.useState([""]);

  const mongoTools = new MongoTools();

  const rerender = function () {
    //I promise ill find a better way later... useReducer isnt working

    window.location.reload();
  };

  const updateUserTbData = function (doRerender?: boolean | undefined) {
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
          auth: await getUserIdToken(),
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

  const updateCodeTbData = function (doRerender?: boolean | undefined) {
    mongoTools.collection("settings").then((res) => {
      console.log(res);
      SETcodeTbData(res);

      const allCodes = res.map((item: type_codeData) => {
        return item.value;
      });

      SETcodesDropdown(allCodes);

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
        <CreateAttendanceCode {...{ mongoTools, updateCodeTbData }} />
        {/* <EditAttendanceCode
          {...{ mongoTools, codesDropdown, updateCodeTbData }}
        /> */}
        <DeleteAttendanceCode
          {...{ mongoTools, codesDropdown, updateCodeTbData }}
        />
      </section>
    </section>
  );
}

type type_CACProps = {
  mongoTools: MongoTools;
  updateCodeTbData: (doRerender?: boolean | undefined) => void;
};
function CreateAttendanceCode({ mongoTools, updateCodeTbData }: type_CACProps) {
  const [formValue, SETformValue] = React.useState("");

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

    try {
      mongoTools
        .updateData(
          { value: formValue },
          { key: (e.target as any)["key"].value },
          "settings"
        )
        .then(() => {
          updateCodeTbData(true);
        });
    } catch (err) {
      console.warn(err);

      toast.error("Something went wrong.");
      toast("Please refresh page and try again");
    }

    toast.success(
      `Created ${(e.target as any)["key"].value} key: ${formValue}`
    );

    SETformValue("");
  };

  return (
    <section className="container">
      <form onSubmit={handleSubmit} data-keyGen>
        <select name="key" className="formInput">
          {SECRETS.CODES_OPTIONS.map((code) => (
            <option key={code}>{code}</option>
          ))}
        </select>
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
  );
}

// type type_EACProps = {
//   mongoTools: MongoTools;
//   codesDropdown: string[];
//   updateCodeTbData: (rerender?: boolean) => void;
// };
// function EditAttendanceCode({
//   mongoTools,
//   codesDropdown,
//   updateCodeTbData
// }: type_EACProps) {
//   const [formValue, SETformValue] = React.useState("");

//   const handleSubmit = function (e: React.FormEvent) {
//     e.preventDefault();

//     mongoTools.updateData(
//       { value: formValue },
//       { value: (e.target as any)["code"].value },
//       "settings"
//     );

//     toast.success(`Updated ${(e.target as any)["code"].value} to ${formValue}`);

//     updateCodeTbData(true);
//   };

//   return (
//     <section className="container">
//       <form onSubmit={handleSubmit} data-keyGen>
//         <select name="code" className="formInput">
//           {codesDropdown.map((code) => (
//             <option key={code}>{code}</option>
//           ))}
//         </select>
//         <input
//           type="text"
//           placeholder="NEW VALUE"
//           className="formInput"
//           value={formValue}
//           onChange={(e) => SETformValue(e.target.value)}
//           required
//         />
//         <button data-submit>Change Code</button>
//       </form>
//     </section>
//   );
// }

type type_DACProps = {
  mongoTools: MongoTools;
  codesDropdown: string[];
  updateCodeTbData: (rerender?: boolean) => void;
};
function DeleteAttendanceCode({
  mongoTools,
  codesDropdown,
  updateCodeTbData
}: type_DACProps) {
  const [deleteAll, SETdeleteAll] = React.useState(false);

  const handleSubmit_deleteCode = function (e: React.FormEvent) {
    e.preventDefault();

    if (deleteAll) {
      mongoTools.delete({}, true, "settings");
      toast.success("Deleted all codes");
    } else {
      mongoTools.delete(
        { value: (e.target as any)["code"].value },
        false,
        "settings"
      );
      toast.success(`Deleted ${(e.target as any)["code"].value}`);
    }

    updateCodeTbData();
  };

  return (
    <section className="container">
      <form onSubmit={handleSubmit_deleteCode} data-codeEdit>
        <select name="code" className="formInput">
          {codesDropdown.map((code) => (
            <option key={code}>{code}</option>
          ))}
        </select>
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
  );
}
