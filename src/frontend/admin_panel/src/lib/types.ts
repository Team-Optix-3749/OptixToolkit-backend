import { SetStateAction } from "react";

export type type_dbDataSetState = [Object | undefined, SetStateAction<{}>];

export type validationState = true | false | "notAuthorized" | "error";

export type type_codeData = {
  key: string,
  value: string
} 