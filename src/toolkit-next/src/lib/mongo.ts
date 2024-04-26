import { Db, MongoClient } from "mongodb";
import { baseFetchURL } from "./config";
import { getCurrentUser } from "./firebase";

let mongoUrl = "mongodb://127.0.0.1:27017/toolkit";
let updatedMongoUrl = false;
let mongoClient: MongoClient;

async function updateMongoUrl(userToken?: string) {
  let cpy_userToken = userToken || "";

  if (!userToken) {
    const user = await getCurrentUser();

    if (!user) {
      console.error("Attempted to call updateMongoUrl with no logged in user");
      return;
    }

    cpy_userToken = await user.getIdToken();
  }

  const new_mongoUrl: string = await fetch(baseFetchURL + "/api/db", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      auth: cpy_userToken
    })
  }).then((res) => res.json());

  console.log(new_mongoUrl);

  mongoUrl = new_mongoUrl;
  updatedMongoUrl = true;
}

type mongoFunction = (client: Db) => any;
export async function getMongoData(mongoFunction: mongoFunction) {
  let data: any;
  let client: MongoClient;

  try {
    await init_mongo();
    // console.log(mongoClient)
    client = await mongoClient.connect();

    const db = await mongoClient.db();
    data = await mongoFunction(db);

    await client.close();
  } catch (err) {
    console.warn(err);
  } finally {
    return data;
  }
}

async function init_mongo() {
  if (!updatedMongoUrl) await updateMongoUrl();
  updatedMongoUrl = true;

  mongoClient = new MongoClient(mongoUrl);
}
