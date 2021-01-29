import { NowRequest, NowResponse } from '@vercel/node'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function get_category(req: NowRequest, res: NowResponse) {
	if (await authorize(req.body.auth)) {
		if (typeof req.body.category !== 'string') {
			res.status(400).json({ err: 'Bad Params!' })
			return
		}
		const toolsRes = await tools.find({ category: req.body.category })
		res.status(200).json({ tools: toolsRes, err: false })
	} else {
		res.status(400).json({ err: 'Unauthorized request!' })
	}
}
