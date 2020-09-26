import * as admin from 'firebase-admin'

const serviceAccount = require('../secrets/firebaseServiceKey.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
})

export default async function authorize(token: string) {
  console.log(token)
  if (token == undefined) return false
  console.log("function continued")
  try {
    const user = await admin.auth().verifyIdToken(token)
    if (!user.member) throw new Error('Invalid user!')
    return true
  }
  catch (e) {
    return false
  }
}