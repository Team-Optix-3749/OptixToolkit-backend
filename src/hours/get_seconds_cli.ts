import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { users } from '../utils/models'

export default async function get_seconds_cli(req: Request, res: Response) {
  const user = await authorize(req.body.auth)

  if (!user) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

  
  try {
	 const userDoc = await users.findOne({ uid: req.body.uid })
    res.status(200).json({ seconds: userDoc.seconds, err: false })
  } catch (e) {
    res.status(400).json({ err: "Server Error" })
  } 
}
