import SECRETS from "../../secrets";
import { getIdToken } from "../auth/authTools";

type collections = "users" | "settings";

export class MongoDBCollection {
  _collectionName: collections;
  _collection: any;

  constructor(collectionName: collections) {
    this._collectionName = collectionName;
  }

  async collection() {
    if (this._collection) return this._collection;
  
    try {
      const idToken = await getIdToken();
      const { collection } = await fetch(`${SECRETS.BACKEND_URL}/api/db`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          auth: idToken,
          endpoint: `get-${this._collectionName}`
        })
      }).then((res) => res.json());

      this._collection = collection;
      return collection;
    } catch (err) {
      console.warn(err);
    }
  }
}
