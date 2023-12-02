import { SetStateAction } from "react";

export type type_dbDataSetState = [Object | undefined, SetStateAction<{}>];

export type firebaseConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

export type isValidated = "true" | "false" | "notAuthorized" | "error"