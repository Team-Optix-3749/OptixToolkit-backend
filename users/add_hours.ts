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

let id_token = undefined

const newline = /\r?\n/
const csvStr = fs
	.readFileSync(path.join(__dirname, 'hours.csv'), { encoding: 'utf-8' })
	.toString()

const csv = csvStr
	.split(newline)

async function dosa(HRS, THEEMAIL) {
	try {
		if (!id_token) {
            const { user } = await firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
		    id_token = await user.getIdToken()
        }

		console.log('SENDING REQUEST')

        const uid = (await admin.auth().getUserByEmail(THEEMAIL)).uid;

		const res6 = await fetch('https://toolkit.team3749.org', {
			method: 'post',
			headers: {
				'Content-type': 'application/json',
				Accept: 'application/json',
				'Accept-Charset': 'utf-8',
			},
			body: JSON.stringify({
				endpoint: 'add-hours',
				auth: id_token,
				uid,
				seconds: HRS * 60 * 60 * 1000,
			}),
		})
		console.log(await res6.json())
	} catch (e) {
		console.log(e)
	}
}

async function main() {
    for (const row of csv) {
        if (row.split(',').length < 2) continue
        const [email, hrs] = row.split(',')
        await dosa(Number(hrs), email)
    }
}

main()
