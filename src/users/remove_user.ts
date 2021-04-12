import { NowRequest, NowResponse } from '@vercel/node'
import { authorize, removeUser } from '../utils/firebase'



export default async function remove_user(req: NowRequest, res: NowResponse) {
	if (!(await authorize(req.body.auth, { admin: true }))) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	try {
    if (typeof(req.body.uid) !== "string") throw new Error("Bad Params!")
		
    await removeUser(req.body.uid)

		res.status(200).json({ err: false })
	} catch (e) {
		console.log(e)
		res.status(400).json({ err: 'Bad Params!' })
	}
}
