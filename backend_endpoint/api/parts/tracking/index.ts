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
				err: 'Invalid request: please specify trackingId AND courierName!',
			})
		)
		return
	}

	const { trackingId, courierName } = req.body
	const courier = tracker.courier(
		tracker.COURIER[`${courierName}`.toUpperCase()].CODE
	)

	courier.trace(trackingId, (err, result) => {
		if (!err) {
			res.send(
				JSON.stringify(
					{
						status: 'success',
						data: result.status.toLowerCase(),
					},
					null,
					2
				)
			)
			return
		}
		res.send(
			JSON.stringify({
				status: 'fail',
				data: err,
			})
		)
	})
}
