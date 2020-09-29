import * as admin from 'firebase-admin'

const serviceAccount = require('../secrets/firebaseServiceKey.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
})

interface options {
  admin: boolean
}

export default async function authorize(token: string, options: options = { admin: false }) {
  if (token == undefined) return false
  try {
    const user = await admin.auth().verifyIdToken(token)
    if (!user.member) throw new Error('Invalid user!')
    if (!user.admin && options.admin) throw new Error('User not Admin!')
    return true
  }
  catch (e) {
    return false
  }
}