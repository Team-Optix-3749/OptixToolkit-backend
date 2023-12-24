import SECRETS from "../../config";
import { getIdToken } from "../auth/authTools";

type collection = "users" | "settings";

export class MongoTools {
  async collection(collectionName: collection) {
    const idToken = await getIdToken();
    const { collection } = await fetch(`${SECRETS.BACKEND_URL}/api/db`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        auth: idToken,
        endpoint: `get-${collectionName}`
      })
    }).then((res) => res.json());

    return collection;
  }

  async pushData(setObj: {}, collectionName: collection) {
    const idToken = await getIdToken();

    try {
      await fetch(`${SECRETS.BACKEND_URL}/api/db`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          auth: idToken,
          endpoint: `push-${collectionName}`,
          payload: {
            data: setObj
          }
        })
      })
    } catch (err) {
      throw new Error("error");
    }
  }

  async delete(filter: {}, many: boolean, collectionName: collection) {
    const idToken = await getIdToken();

    try {
      await fetch(`${SECRETS.BACKEND_URL}/api/db`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          auth: idToken,
          endpoint: `delete-${collectionName}`,
          payload: {
            filter,
            many
          }
        })
      })
    } catch (err) {
      throw new Error("error");
    }
  }
}
