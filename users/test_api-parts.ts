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
const SERVER_URL = process.env.SERVER_URL

async function main() {
	const { user } = await firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
  const id_token = await user.getIdToken()
  
  console.log("SENDING REQUEST")

  /*await fetch(SERVER_URL+'parts/add', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: JSON.stringify({
      auth: id_token,
      uid: user.uid,
      name: 'rohans_part',
      link: 'https://rohanj.dev',
      trackingInfo: {
        trackingId: 'LZ661737688US',
        carrier: 'USPS'
      },
      description:'cool part',
      priority: 3
		}),
  })*/


	const res = await fetch(SERVER_URL+'parts/get', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: JSON.stringify({
			auth: id_token,
		}),
	})

  const json = await res.json()
  console.log(json)
  console.log(json.parts[0].trackingInfo)
}

main()
