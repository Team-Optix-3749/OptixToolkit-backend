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
	const { user } = await firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
  const id_token = await user.getIdToken()
  
  console.log("SENDING REQUEST")

  const res2 = await fetch('http://localhost:3000/api/parts/add', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: JSON.stringify({
      auth: id_token,
      uid: user.uid,
      name: 'a_cool_part',
      link: 'https://aaditgupta.tech',
      trackingNumber: 'LZ661737688US',
      description:'cool part',
      priority: 3
		}),
  })


	const res = await fetch('http://localhost:3000/api/parts/get', {
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

  console.log(await res.json())
  
}

main()
