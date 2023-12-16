const SECRETS = {
  BACKEND_URL: "http://localhost:4000",
  TABLE_DEFS: [
    { field: "displayName", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "hours", headerName: "Participation Hours" },
    { field: "certified" },
    { field: "meetingCount" },
    { field: "lastCheckIn" },
    { field: "uid", headerName: "UserID" }
  ],

  FIREBASECFG: {
    apiKey: "AIzaSyBywkBF8HlaLDTgvPM2bxCGXaBuhs8__7I",
    authDomain: "optixtoolkit.firebaseapp.com",
    databaseURL: "https://optixtoolkit.firebaseio.com/",
    projectId: "optixtoolkit",
    storageBucket: "optixtoolkit.appspot.com",
    messagingSenderId: "227710522821",
    appId: "1:227710522821:web:8992302e340bb9c1b767ac",
    measurementId: "G-0M4XPGFFXM"
  }
};

export default SECRETS;
