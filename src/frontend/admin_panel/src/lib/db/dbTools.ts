import * as Realm from "realm-web";
import { initializeApp } from "firebase/app";
import { DocumentReference, getFirestore, doc } from "firebase/firestore/lite";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { firebaseConfig } from "../types";
import * as SECRETS from "../secrets";

const realmApp = new Realm.App({ id: SECRETS.MONGO_ID });
const mongo = realmApp.currentUser?.mongoClient("mongodb-atlas");

export const firebaseApp = initializeApp(SECRETS.FIREBASE_CFG);
const firestore = getFirestore(firebaseApp);

console.log(firebaseApp);

export async function getUserData(userID: string) {
  const login = Realm.Credentials.anonymous();
  realmApp.logIn(login);

  if (!mongo) throw new Error("Mongo DB current user undefined");
  const users_collection = mongo?.db("ToolkitData").collection("userData");

  return await users_collection.findOne({ uid: userID });
}

// let adminUsers: string[];
// export async function getAdminUsers() {
//   //write code to get valid users from firebase
//   if (adminUsers) return adminUsers;

//   const [value, , error] = useDocumentData(doc(firestore, "users/admins"));

//   if (error) throw new Error(error as unknown as string);

//   console.log(value);

//   const fetchedValidUsers: string[] = [];
//   adminUsers = fetchedValidUsers;

//   return adminUsers;
// }
