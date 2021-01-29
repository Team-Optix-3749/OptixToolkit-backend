import { NowRequest, NowResponse } from '@vercel/node'
import { tools } from '../../../src/utils'
import { authorize } from '../../../src/utils'

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (await authorize(req.body.auth)) {
		if (typeof req.body.name !== 'string') {
			res.status(400).json({ err: 'Bad Params!' })
			return
		}
		const toolRes = await tools.findOne({ name: req.body.name })
		res.status(200).json({ tool: toolRes, err: false })
	} else {
		res.status(400).json({ err: 'Unauthorized request!' })
	}
}
