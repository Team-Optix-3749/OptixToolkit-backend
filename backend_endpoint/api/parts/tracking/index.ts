import { NowRequest, NowResponse } from '@vercel/node'
import * as tracker from 'delivery-tracker'

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (
		req.body === undefined ||
		req.body.trackingId === undefined ||
		req.body.courierName === undefined
	) {
		res.send(
			JSON.stringify({
				err:
					'Invalid request: please specify tracking_id AND courier_name!',
			})
		)
		return
	}

	const { trackingId, courierName } = req.body
	const courier = tracker.courier(
		tracker.COURIER[`${courierName}`.toUpperCase()].CODE
	)

	let done = false
	courier.trace(trackingId, (err, result) => {
		if (!err) {
			res.send(JSON.stringify(result))
			done = true
		}
		res.send(JSON.stringify(err))
	})
	if (!done) {
		res.send(
			JSON.stringify({
				error: 'Oh no! There was an error!',
			})
		)
	}
}
