import { config } from 'dotenv'
import * as Easypost from '@easypost/api'

config()

const api = new Easypost(process.env.TOKEN);


module.exports = async (req: NowRequest, res: NowResponse) => {
	if (req.body === undefined || req.body.trackingId === undefined || req.body.carrier === undefined) {
		res.send(
			JSON.stringify({
				err: 'Invalid request: please specify trackingId or carrier!',
			})
		)
		return
	}
  

  const tracker = new api.Tracker({
    tracking_code: req.body.trackingId,
    carrier: req.body.carrier,
  });

  tracker.save().then(console.log);

}
