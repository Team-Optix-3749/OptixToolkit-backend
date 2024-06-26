import { Request, Response } from 'express'
import { authorize, certifyUser, listUsers } from '../utils/firebase'



export default async function list_users(req: Request, res: Response) {
	if (!(await authorize(req.body.auth, { type: 'admin' }))) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	try {
    if (!req?.body.uid) throw new Error("no uid specified")
    await certifyUser(req.body.uid)
		res.status(200).json({ err: false, })
	} catch (e) {
		console.log(e)
		res.status(400).json({ err: 'Bad Params!' })
	}
}
