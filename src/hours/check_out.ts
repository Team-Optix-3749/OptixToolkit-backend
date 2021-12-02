import { Request, Response } from 'express'
import { settings, users } from '../utils/models'
import { authorize } from '../utils/firebase'

export default async function check_out(req: Request, res: Response) {
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

	const setting = await settings.findOne({ key: 'checkOutPassword' })
	if (req.body.password !== setting.value) {
		res.status(400).json({ err: 'Check Out Password Wrong! ' })
		return
	}

	const userDoc = await users.findOne({ uid: user.uid })
	const attendanceOverride = await settings.findOne({
		key: 'attendanceOverride',
	})

	var date = new Date(Date.now() * 1000 - 1000 * 8 * 3600)

	if (userDoc.lastCheckIn === 0) {
		res.status(400).json({ err: 'You are not checked in!' })
		return
	} else if (attendanceOverride) {
		userDoc.seconds = Date.now() - userDoc.lastCheckIn
		userDoc.lastCheckIn = 0
		userDoc.meetingCount++
	} else if (weekdays.includes(days[date.getDay()])) {
		if (date.getHours() >= 15 && date.getHours() <= 18) {
			userDoc.seconds = Date.now() - userDoc.lastCheckIn
			userDoc.lastCheckIn = 0
			userDoc.meetingCount++
		} else {
			res.status(400).json({ err: 'Not in meeting time!' })
			return
		}
	} else if (days[date.getDay()] === 'Saturday') {
		if (date.getHours() >= 8 && date.getHours() <= 17) {
			userDoc.seconds = Date.now() - userDoc.lastCheckIn
			userDoc.lastCheckIn = 0
			userDoc.meetingCount++
		} else {
			res.status(400).json({ err: 'Not in meeting time!' })
			return
		}
	} else {
		res.status(400).json({ err: 'No meeting today!' })
		return
	}

	await userDoc.save()

	res.status(200).json({ err: false })
}
