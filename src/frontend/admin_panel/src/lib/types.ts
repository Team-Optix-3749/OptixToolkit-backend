import { SetStateAction } from "react";

export type type_dbDataSetState = [Object | undefined, SetStateAction<{}>];

export type validationState = true | false | "notAuthorized" | "error";