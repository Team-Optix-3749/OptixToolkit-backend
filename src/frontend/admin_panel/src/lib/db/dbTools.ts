import * as Realm from "realm-web";

const SECRETS = import.meta.env;

const realmApp = new Realm.App({ id: SECRETS.VITE_MONGO_ID });
const mongo = realmApp.currentUser?.mongoClient("mongodb-atlas");

let validUsers: string[];

export async function main() {
  const login = Realm.Credentials.anonymous();
  realmApp.logIn(login);

  if (!mongo) throw new Error("Mongo DB current user undefined");
  const users_collection = mongo?.db("ToolkitData").collection("userData");
}

export async function getValidUsers() {
  //write code to get valid users from firebase
  if (validUsers) return validUsers;

  const fetchedValidUsers: string[] = await new Promise((res) => {
    console.log('we ran')
    res(['foo']);
  });
  
  validUsers = fetchedValidUsers;

  return validUsers
}
