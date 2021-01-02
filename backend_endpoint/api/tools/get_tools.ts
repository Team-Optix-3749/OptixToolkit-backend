import { NowRequest, NowResponse } from '@vercel/node'
import { tools } from '../utils/utils'
import { authorize } from '../utils/utils'

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (await authorize(req.body.auth)) {
		const toolsRes = await tools.find()
		res.status(200).json({ tools: toolsRes, err: false })
	} else {
		res.status(400).json({ err: 'Unauthorized request!' })
	}
}
