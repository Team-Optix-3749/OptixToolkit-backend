const SECRETS = {
  BACKEND_URL: "http://localhost:4000",
  USER_TABLE_DEFS: [
    { field: "displayName", headerName: "Name" },
    { field: "email", headerName: "Email" },
    {
      field: "hours",
      headerName: "Participation Hours",
      comparator: (valueA: any, valueB: any) => Number(valueA) - Number(valueB)
    },
    { field: "certified" },
    { field: "meetingCount" },
    { field: "lastCheckIn" },
    { field: "uid", headerName: "UserID" }
  ],
  CODE_TABLE_DEFS: [
    { field: "key", headerName: "Code Type" },
    { field: "value", headerName: "Value" }
  ],

  CODES_OPTIONS: ['checkInPassword', 'checkOutPassword', 'attendanceOverride'],

  FIREBASECFG: {
    apiKey: "AIzaSyDI04e7u2jaeyjvjZTZCyits0KeMI6KKIk",
    authDomain: "garageopener-27000.firebaseapp.com",
    databaseURL: "https://garageopener-27000-default-rtdb.firebaseio.com",
    projectId: "garageopener-27000",
    storageBucket: "garageopener-27000.appspot.com",
    messagingSenderId: "1066651715164",
    appId: "1:1066651715164:web:b16a994346ad5fc20e8899",
    measurementId: "G-YSQX2FQCZX"
  }
};

export default SECRETS;
