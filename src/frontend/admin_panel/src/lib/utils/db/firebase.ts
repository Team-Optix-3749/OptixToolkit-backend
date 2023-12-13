import { FirebaseApp, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDI04e7u2jaeyjvjZTZCyits0KeMI6KKIk",
  authDomain: "garageopener-27000.firebaseapp.com",
  databaseURL: "https://garageopener-27000-default-rtdb.firebaseio.com",
  projectId: "garageopener-27000",
  storageBucket: "garageopener-27000.appspot.com",
  messagingSenderId: "1066651715164",
  appId: "1:1066651715164:web:b16a994346ad5fc20e8899",
  measurementId: "G-YSQX2FQCZX"
};

//house -> users
//settings & keys -> settings
//new one for parts barcodse

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

// const firestore = getFirestore(firebaseApp);

// export async function getUserData(userID: string) {
//   const login = Realm.Credentials.anonymous();
//   realmApp.logIn(login);

//   if (!mongo) throw new Error("Mongo DB current user undefined");
//   const users_collection = mongo?.db("ToolkitData").collection("userData");

//   return await users_collection.findOne({ uid: userID });
// }

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
