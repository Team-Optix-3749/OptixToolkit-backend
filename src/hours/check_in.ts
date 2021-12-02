import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { settings, users } from '../utils/models'

export default async function check_in(req: Request, res: Response) {
	const user = await authorize(req.body.auth)
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	]
	const weekdays = ['Tuesday', 'Thursday']

	if (!user) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	const setting = await settings.findOne({ key: 'checkInPassword' })
	if (req.body.password !== setting.value) {
		res.status(400).json({ err: 'Check In Password Wrong! ' })
		return
	}

	const userDoc = await users.findOne({ uid: user.uid })
	const attendanceOverride = await settings.findOne({ key: 'attendanceOverride' })

	var date = new Date(Date.now() * 1000 - 1000 * 8 * 3600)

  if (userDoc.attendanceStatus !== "notLogging") {
	  res.status(400).json({ err: 'You are already checked in!' })
  }
  else if (attendanceOverride) {
		userDoc.lastCheckIn = Date.now()
  }
	else if (weekdays.includes(days[date.getDay()])) {
		if (date.getHours() >= 15 && date.getHours() <= 18) {
			userDoc.lastCheckIn = Date.now()
		} else {
			res.status(400).json({ err: 'Not in meeting time!' })
			return
		}
	} else if (days[date.getDay()] === 'Saturday') {
		if (date.getHours() >= 8 && date.getHours() <= 17) {
			userDoc.lastCheckIn = Date.now()
		} else {
			res.status(400).json({ err: 'Not in meeting time!' })
			return
		}
	} else {
		res.status(400).json({ err: 'No meeting today!' })
		return
	}

	await userDoc.save()

	try {
		res.status(200).json({ err: false })
	} catch (e) {
		res.status(400).json({ err: 'Server Error' })
	}
}
