import * as admin from 'firebase-admin'
import firebase from '@firebase/app'
import '@firebase/auth'
import fs from 'fs'
import path from 'path'
const serviceAccount = require('./firebaseServiceKey.json')

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

async function createAdmin(email: string, name: string) {
	let user: admin.auth.UserRecord
	try {
		user = await admin.auth().createUser({
			email: email,
			displayName: name,
		})
	} catch (e) {
		user = await admin.auth().getUserByEmail(email)
		await admin.auth().updateUser(user.uid, {
			email: user.email,
			displayName: name,
		})
	}

	await admin
		.auth()
		.setCustomUserClaims(user.uid, { admin: true, member: true })

	return firebase.auth().sendPasswordResetEmail(email)
}

async function createMember(email: string, name: string) {
	let user: admin.auth.UserRecord
	try {
		user = await admin.auth().createUser({
			email: email,
			displayName: name,
		})
	} catch (e) {
		user = await admin.auth().getUserByEmail(email)
		await admin.auth().updateUser(user.uid, {
			email: email,
			displayName: name,
		})
	}

	await admin.auth().setCustomUserClaims(user.uid, { member: true })

	return firebase.auth().sendPasswordResetEmail(email)
}

const newline = /\r?\n/
const csv = fs
	.readFileSync(path.join(__dirname, 'users.csv'), { encoding: 'utf-8' })
	.toString()
	.split(newline)

const promises = []

for (const row of csv) {
	if (row.split(',').length < 3) continue
	const [name, email, status] = row.split(',')

	if (status.toLowerCase() == 'admin') {
		const promise = createAdmin(email, name)
			.then(() => {
				console.log(`${name} created successfully as Admin`)
			})
			.catch((e) => {
				console.error(`Error occured for ${name} as Admin: ${e.message}`)
			})
		promises.push(promise)
	} else {
		const promise = createMember(email, name)
			.then(() => {
				console.log(`${name} created successfully as Member`)
			})
			.catch((e) => {
				console.error(`Error occured for ${name} as Member: ${e.message}`)
			})
		promises.push(promise)
	}
}

Promise.all(promises).finally(() => {
	console.log('Completing program...')
	process.exit(0)
})
/*createAdmin('admin@team3749.org', 'Admin').then(() => {
	console.log('job finished')
	process.exit()
})*/
