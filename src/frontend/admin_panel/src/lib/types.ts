import { SetStateAction } from "react";

export type type_dbDataSetState = [Object | undefined, SetStateAction<{}>];

export type isValidated = true | false | "notAuthorized" | "error"