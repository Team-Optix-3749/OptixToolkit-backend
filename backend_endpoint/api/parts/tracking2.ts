import { config } from 'dotenv'
import Easypost from '@easypost/api'
import { NowRequest, NowResponse } from '@vercel/node'

config()

const key = process.env.KEY

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (req.body === undefined || req.body.trackingId === undefined || req.body.carrier === undefined) {
		res.send(
			JSON.stringify({
				err: 'Invalid request: please specify trackingId or carrier!',
			})
		)
		return
	}
  const api = new Easypost(key);

  const tracker = new api.Tracker({
    tracking_code: req.body.trackingId,
    carrier: req.body.carrier,
  });

  tracker.save().then(status => {
		res.send(
			JSON.stringify(
				{
					status: 'success',
					data: status.status,
				},
				null,
				2
			)
		)
		return
  })




}
