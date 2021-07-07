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

	console.log('SENDING REQUEST')

	/*const res2 = await fetch('http://localhost:3000/api/tools/add_tool', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: JSON.stringify({
      auth: id_token,
      name: 'Sample Tool 1',
      category: 'Sample Tool'
		}),
  })

  const res3 = await fetch('http://localhost:3000/api/tools/add_tool', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: JSON.stringify({
      auth: id_token,
      name: 'Sample Tool 2',
      category: 'Sample Tool'
		}),
  })

  console.log(await res2.json(), await res3.json())

	const res = await fetch('http://localhost:3000/api/tools/get_tools', {
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

  const res5 = await fetch('http://localhost:3000/api/tools/get_category', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: JSON.stringify({
      auth: id_token,
      category: 'Sample Tool'
		}),
	})
  console.log(await res5.json())

  const res6 = await fetch('http://localhost:3000/api/tools/get_tool', {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			'Accept-Charset': 'utf-8',
		},
		body: JSON.stringify({
      auth: id_token,
      name: 'Sample Tool 2'
		}),
	})
  console.log(await res6.json())*/

	try {
		const res6 = await fetch('http://localhost:3000/api/tools/get_tools', {
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
		console.log((await res6.json()).tools.map((thing) => thing.reservations))
	} catch (e) {
		console.log(e)
	}
}

main()
