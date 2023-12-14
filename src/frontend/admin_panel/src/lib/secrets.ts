const VITE_ENV = import.meta.env;

const SECRETS = {
  BACKEND_URL: VITE_ENV.VITE_BACKEND_URL,
  TABLE_DEFS: [
    { field: "userName", headerName: "Name" },
    { field: "hours", headerName: "Participation Hours" },
    { field: "meetingCount" },
    { field: "seconds", headerName: "Participation Seconds" },
    { field: "lastCheckIn" },
    { field: "uid", headerName: "UserID" }
  ]
};

export default SECRETS;
