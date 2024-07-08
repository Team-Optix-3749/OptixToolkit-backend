type t_Users = {
  _oid: string;
  uid: string;
  lastCheckIn: number;
  seconds: number;
  meetingCount: number;
};

type t_Settings = {
  _oid: string;
  key: "checkInPassword" | "checkOutPassword" | "attendanceOverride";
  value: string;
};
