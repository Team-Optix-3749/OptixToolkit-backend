import { NowRequest, NowResponse } from '@vercel/node'
import * as tracker from 'delivery-tracker'

const fetch = require('node-fetch')

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (req.body === undefined || req.body.trackingId === undefined) {
		res.send(
			JSON.stringify({
				err: 'Invalid request: please specify trackingId AND courierName!',
			})
		)
		return
	}

	const fetcher = await fetch(
		`https://shipit-api.herokuapp.com/api/guess/${req.body.trackingId}`
	)

	const courierName = await fetcher.json()

	const { trackingId } = req.body
	const courier = tracker.courier(
		tracker.COURIER[`${courierName[0]}`.toUpperCase()].CODE
	)

	courier.trace(trackingId, (err, result) => {
		if (!err) {
			res.send(
				JSON.stringify(
					{
						status: 'success',
						data: result.status,
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
