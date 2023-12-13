const VITE_ENV = import.meta.env;

const SECRETS = {
  BACKEND_URL: VITE_ENV.VITE_BACKEND_URL,
  TABLE_DEFS: [
    { field: "uid", headerName: "UserID" },
    { headerName: "Seconds", field: "seconds", headerStyle: { width: "5rem" } },
    { field: "lastCheckIn" },
    { field: "meetingCount" }
  ]
};

export default SECRETS;
