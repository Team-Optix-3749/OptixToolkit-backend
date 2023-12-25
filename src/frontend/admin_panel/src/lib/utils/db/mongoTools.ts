import SECRETS from "../../config";
import { getIdToken } from "../auth/authTools";

type collection = "users" | "settings";

export class MongoTools {
  private async request(url: string, body: {}, callback?: (any: any) => {}) {
    let res:any;
    try {
      const idToken = await getIdToken();
      res = await fetch(`${SECRETS.BACKEND_URL}${url}`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          auth: idToken,
          ...body
        })
      })
        .then((res) => res.json())
        .then(callback);
    } catch (err) {
      console.warn(err);
    }

    return res;
  }

  async collection(collectionName: collection) {
    return this.request(
      `/api/db`,
      { endpoint: `get-${collectionName}` },
      (res: any) => res.collection
    );
  }

  async pushData(setObj: {}, collectionName: collection) {
    this.request(`/api/db`, {
      endpoint: `push-${collectionName}`,
      payload: { data: setObj }
    });
  }

  async updateData(setObj: {}, filter: {}, collectionName: collection) {
    this.request(`/api/db`, {
      endpoint: `update-${collectionName}`,
      payload: { update: setObj, filter }
    });
  }

  async delete(filter: {}, many: boolean, collectionName: collection) {
    this.request(`/api/db`, {
      endpoint: `delete-${collectionName}`,
      payload: {
        filter,
        many
      }
    });
  }
}
