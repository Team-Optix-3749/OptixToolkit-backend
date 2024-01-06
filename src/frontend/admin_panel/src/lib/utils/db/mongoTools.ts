import SECRETS from "../../config";
import { type_dbCollection } from "../../types";
import { getUserIdToken } from "../auth/authTools";

export class MongoTools {
  private async request(url: string, body: {}, callback?: (any: any) => {}) {
    let res: any;
    try {
      const idToken = await getUserIdToken();
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

  async collection(collectionName: type_dbCollection) {
    return this.request(
      `/api/db`,
      { endpoint: `get-${collectionName}` },
      (res: any) => res.collection
    );
  }

  async pushData(setObj: {}, collectionName: type_dbCollection) {
    this.request(`/api/db`, {
      endpoint: `push-${collectionName}`,
      payload: { data: setObj }
    });
  }

  async updateData(setObj: {}, filter: {}, collectionName: type_dbCollection) {
    this.request(`/api/db`, {
      endpoint: `update-${collectionName}`,
      payload: { update: setObj, filter }
    });
  }

  async delete(filter: {}, many: boolean, collectionName: type_dbCollection) {
    this.request(`/api/db`, {
      endpoint: `delete-${collectionName}`,
      payload: {
        filter,
        many
      }
    });
  }
}
