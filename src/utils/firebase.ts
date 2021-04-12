import * as admin from 'firebase-admin'

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	}),
})

interface options {
	admin: boolean
}

export async function authorize(
	token: string,
	options: options = { admin: false }
) {
	if (token == undefined) return false
	try {
		const user = await admin.auth().verifyIdToken(token)
		if (!user.member) throw new Error('Invalid user!')
		if (!user.admin && options.admin) throw new Error('User not Admin!')
		return user
	} catch (e) {
		return false
	}
}

export async function removeUser(uid: string) {
  return admin.auth().deleteUser(uid)
}

export async function listUsers() {
  return admin.auth().listUsers()
}

export async function appendDisplayName(uid: string, object: any) {
	if (uid === undefined) {
		return {
			...object,
			displayName: 'None',
		}
	}
	try {
		return {
			...object,
			displayName: (await admin.auth().getUser(uid)).displayName,
		}
	} catch (e) {
		return {
			...object,
			displayName: 'None',
		}
	}
}

export async function getDisplayName(uid: string) {
	if (uid === undefined) return 'None'
	try {
		return (await admin.auth().getUser(uid)).displayName
	} catch {
		return uid
	}
}
