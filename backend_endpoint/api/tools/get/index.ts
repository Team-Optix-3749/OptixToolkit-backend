import { NowRequest, NowResponse } from '@vercel/node'
import * as admin from 'firebase-admin'
import { tools } from '../../utils/models'

const serviceAccount = require('../../secrets/firebaseServiceKey.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
})

module.exports = async (req: NowRequest, res: NowResponse) => {
	try {
		const { auth } = req.body
		const user = await admin.auth().verifyIdToken(auth)
		if (!user.member) throw new Error('Invalid user!')
	} catch (e) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	const toolsRes = await tools.find()

	res.status(200).json({ toolsRes })
}

/*

FOR USE LATER

async function addTool (tool: Tool) {
  return tools.create(tool)
}

async function removeTool() {

}
*/
