import { NowRequest, NowResponse } from '@vercel/node'
import { parts, Part } from '../utils/utils'
import { authorize } from '../utils/utils'
import { trackPackage } from '../utils/utils'

function validatePart(body: any): body is Part {
	return (
		typeof body.uid === 'string' &&
		typeof body.name === 'string' &&
		typeof body.link === 'string' &&
		typeof body.trackingInfo.trackingId === 'string' &&
		typeof body.trackingInfo.carrier === 'string' &&
		typeof body.description === 'string' &&
		typeof body.priority === 'number'
	)
}

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (req.body === undefined) {
		res.status(400).json({ err: 'No Body!' })
		return
	}

	if (!(await authorize(req.body.auth, { admin: true }))) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	try {
		console.log('REQ BODY BELOW')
		console.log(req.body)
		if (!validatePart(req.body)) {
			throw new Error('Bad params')
		}
		req.body.status = await trackPackage(
			req.body.trackingInfo.trackingId,
			req.body.trackingInfo.carrier
		)
		await parts.create(req.body)
		res.status(200).json({ err: false })
	} catch (e) {
		res.status(400).json({ err: e.message })
	}
}
