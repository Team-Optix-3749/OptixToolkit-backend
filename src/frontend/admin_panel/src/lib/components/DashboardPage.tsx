import React from "react";
import toast from "react-hot-toast";

import { signOut } from "../utils/auth/authTools";

export default function DashboardPage() {
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
  }, []);

  return (
    <main>
      {
        //Use ag-grid tables
      }
      <button>asdfiasdhoif</button>
      
    </main>
  );
}
