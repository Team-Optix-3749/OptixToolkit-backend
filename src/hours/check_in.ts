import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { settings, users } from '../utils/models'

export default async function check_in(req: Request, res: Response) {
  const user = await authorize(req.body.auth)

  if (!user) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

  const setting = await settings.findOne({ key: "checkInPassword" })
  if (req.body.password !== setting.value) {
    res.status(400).json({ err: "Check In Password Wrong! "})
    return
  }

  const userDoc = users.findOne({ uid: user.uid })

  userDoc.lastCheckIn = Date.now()

  try {
    res.status(200).json({ err: false })
  } catch (e) {
    res.status(400).json({ err: "Server Error" })
  }
}