import { Db, FindCursor, MongoClient, WithId, Document } from "mongodb";
import { MONGO_URL } from "../utils/config";

let mongoClient: MongoClient;
export async function init_mongo() {
  mongoClient = mongoClient || new MongoClient(MONGO_URL || "");
}

type mongoFunction<T> = (db: Db) => T;
export async function mongoReq<T>(mongoFunction: mongoFunction<T>) {
  await init_mongo();
  const db = (await mongoClient.connect()).db();

  let ret = await mongoFunction(db);

  //allows us to use the 'using' keyword
  return {
    ret,
    [Symbol.dispose]: async () => {
      await mongoClient.close();
    }
  };
}

export async function cursorToJSON(cursor: FindCursor<WithId<Document>>) {
  return (await cursor.toArray()).map((item) => {
    return {
      ...item,
      _id: item._id.toJSON()
    };
  });
}

export async function settingsCol() {
  using data = await mongoReq(async (db) => {
    const cursor = db.collection("settings").find({});
    return await cursorToJSON(cursor);
  });

  return data.ret as t_Settings[];
}

export async function usersCol() {
  using data = await mongoReq(async (db) => {
    const cursor = db.collection("users").find({});
    return await cursorToJSON(cursor);
  });

  return data.ret as t_Users[];
}
