import { NowRequest, NowResponse } from '@vercel/node'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function get_tool(req: NowRequest, res: NowResponse) {
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
