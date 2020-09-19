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
		if (!user.admin) throw new Error('Invalid user!')
	} catch (e) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	try {
    if (req.body.name === undefined || req.body.count === undefined || typeof(req.body.name) !== "string" || typeof(req.body.count) !== "number") throw new Error('Bad params')
    console.log("creating tool")
    await tools.create({
      name: req.body.name,
      count: req.body.count
    })
    console.log("tool created")
    res.status(200).json({err: 'none'})
  }
  catch (e) {
    console.log(e)
    res.status(400).json({ err: 'Bad Params!' })
  }
}
