import { NowRequest, NowResponse } from '@vercel/node'
import test from '../../src/test'

module.exports = async (req: NowRequest, res: NowResponse) => {
	switch (req.body.endpoint) {
		case 'test':
			test(req, res)
			break
		default:
			res.status(400).json({ err: 'endpoint doesnt exist!!' })
	}
}
