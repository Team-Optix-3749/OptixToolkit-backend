import { NowRequest, NowResponse } from '@vercel/node'
import { addUser, authorize } from '../utils/firebase'


export default async function add_tool(req: NowRequest, res: NowResponse) {
  if (!req.body) {
    res.status(400).json({ err: 'Bad Params!' })
    return
  }
 
	if (!(await authorize(req.body.auth, { admin: true }))) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	try {
    if (typeof(req.body.name) !== "string" && typeof(req.body.email) !== "string" && typeof(req.body.admin) !== "boolean") throw new Error("Bad Params!")
		
    await addUser(req.body.name, req.body.email, req.body.admin)

		res.status(200).json({ err: false })
	} catch (e) {
		console.log(e)
		res.status(400).json({ err: 'Bad Params!' })
	}
}
