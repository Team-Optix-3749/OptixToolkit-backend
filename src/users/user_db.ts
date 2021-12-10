import { Request, Response } from 'express'
import { users, User } from '../utils/models'
import { authorize } from '../utils/firebase'


export default async function user_db(req: Request, res: Response) {
	try {
		await users.create({
			uid: req.body.uid,
			lastCheckIn: 0,
			seconds: 0,
			meetingCount: 0,
		})
		res.status(200).json({ err: false })
	} catch (e) {
		console.log(e)
		res.status(400).json({ err: 'Bad Params!' })
	}
}
