import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { users } from '../utils/models'

export default async function get_lastcheckin(req: Request, res: Response) {
  const user = await authorize(req.body.auth)

  if (!user) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

  try {
	 let userDoc = await users.findOne({ uid: user.uid })

	  if (userDoc == null) {
		await users.create({
				uid: user.uid,
				lastCheckIn: 0,
				seconds: 0,
				meetingCount: 0,
			})
		userDoc = await users.findOne({ uid: user.uid })
	}
	  
    res.status(200).json({ lastcheckin: userDoc.lastCheckIn, err: false })
  } catch (e) {
    res.status(400).json({ err: "Server Error" })
  } 
}
