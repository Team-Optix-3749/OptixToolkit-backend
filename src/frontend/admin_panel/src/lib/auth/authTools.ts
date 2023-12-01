import { getValidUsers } from "../db/dbTools";

let validUsers: string[];

try {
  getValidUsers().then((res) => {
    validUsers = res;
  });
} catch (err) {
  console.error(err);
}

export function validateLogin_string(data: string) {
  if (!validUsers) throw new Error("Valid Users unloaded");

  if (validUsers.includes(data)) return true;
}
