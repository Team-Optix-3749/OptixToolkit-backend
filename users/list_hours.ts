import firebase from '@firebase/app'
import '@firebase/auth'
import fetch from 'node-fetch'
import { config } from 'dotenv'
import * as admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
const serviceAccount = require('./firebaseServiceKey.json')
config()

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
})

firebase.initializeApp({
	apiKey: 'AIzaSyBywkBF8HlaLDTgvPM2bxCGXaBuhs8__7I',
	authDomain: 'optixtoolkit.firebaseapp.com',
	databaseURL: 'https://optixtoolkit.firebaseio.com',
	projectId: 'optixtoolkit',
	storageBucket: 'optixtoolkit.appspot.com',
	messagingSenderId: '227710522821',
	appId: '1:227710522821:web:8992302e340bb9c1b767ac',
	measurementId: 'G-0M4XPGFFXM',
})
const email = process.env.EMAIL
const password = process.env.PASSWORD

export class MongoTools {
  private async request(url: string, body: {}, callback: (any: any) => {}, idToken: string) {
    let res: any;
    try {
      res = await fetch(`https://optixtoolkit-backend-production-abcd.up.railway.app${url}`, {
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

  async collection(collectionName: any, idToken: string) {
    return this.request(
      `/api/db`,
      { endpoint: `get-${collectionName}` },
      (res: any) => res.collection,
      idToken
    );
  }
}

async function main() {
    const mongoTools = new MongoTools();

const user = await firebase.auth().signInWithEmailAndPassword(email, password);
      const idToken = await user.user.getIdToken();

mongoTools.collection("users", idToken).then(async (res) => {
    res.forEach((userObj: any) => {
      userObj.hours = (userObj.seconds / 1000 / 60 / 60).toPrecision(3);
    });

    const { users } = await fetch(`https://optixtoolkit-backend-production-abcd.up.railway.app/`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        auth: idToken,
        endpoint: `list-users`
      })
    }).then((apiRes) => apiRes.json());

    const mergedArr = res.map((resItem: any) => {
      const foundItem = users.find((item: any) => item.uid === resItem.uid);
      return { ...resItem, ...foundItem };
    });

    const a = (mergedArr.reduce((a, b) => a + b.displayName + "," + b.email + "," + ((b.seconds / 1000 / 60 / 60).toPrecision(3)) + "\n", ""))
    fs.writeFileSync(path.join(__dirname, 'hours-result.csv'), a)
})
}
main();