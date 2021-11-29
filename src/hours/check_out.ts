import { Request, Response } from 'express'
import { settings, users } from '../utils/models'
import { authorize } from '../utils/firebase'

export default async function check_out(req: Request, res: Response) {
  const user = await authorize(req.body.auth)

  if (!user) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

  const setting = await settings.findOne({ key: "checkOutPassword" })
  if (req.body.password !== setting.value) {
    res.status(400).json({ err: "Check Out Password Wrong! "})
    return
  }

  const userDoc = await users.findOne({ uid: user.uid })

  if (userDoc.lastCheckIn === null) {
    res.status(400).json({ err: "You haven't checked in" })
    return
  }

  const timeElapsed = Date.now() - userDoc.lastCheckIn

  userDoc.seconds += timeElapsed

  await userDoc.save()

  res.status(200).json({ err: false })
}
