import firebase from '@firebase/app'
import '@firebase/auth'
import fetch from 'node-fetch'
import { config } from 'dotenv'
config()

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

async function main() {
	try {
		const { user } = await firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
		const id_token = await user.getIdToken()

		console.log('SENDING REQUEST')

		const HRS = 1 //INSERT HOURS HERE
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
				uid: 'INSERT USER UID',
				seconds: HRS * 60 * 60 * 1000,
			}),
		})
		console.log(await res6.json())
	} catch (e) {
		console.log(e)
	}
}

main()
