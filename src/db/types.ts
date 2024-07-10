type t_Users = {
  _id: string;
  uid: string;
  lastCheckIn: number;
  seconds: number;
  meetingCount: number;
};

type t_Settings = {
  _id: string;
  key: "checkInPassword" | "checkOutPassword" | "attendanceOverride";
  value: string;
};

type t_Tools = {
  _id: string;
  reservations: string[];
};

type t_UsingReq<t> = {
  ret: t;
  [Symbol.dispose]: () => void;
};
