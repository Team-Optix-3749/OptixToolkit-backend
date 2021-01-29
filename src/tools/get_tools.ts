import { NowRequest, NowResponse } from '@vercel/node'
import { Tool, tools } from '../utils/models'
import { getDisplayName, authorize } from '../utils/firebase'

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (await authorize(req.body.auth)) {
		let toolsRes = await tools.find()
		let newToolsRes: Tool[] = []
		let allpromises: Promise<string>[] = []
		let done = 0
		toolsRes.forEach(async (tool) => {
			let promises: Promise<string>[] = []
			tool.reservations.forEach((uid) => promises.push(getDisplayName(uid)))
			allpromises.concat(promises)
			tool.reservations = await Promise.all(promises)
			newToolsRes.push(tool)
		})
		await Promise.all(allpromises)
		setTimeout(
			() => res.status(200).json({ tools: newToolsRes, err: false }),
			500
		)
	} else {
		res.status(400).json({ err: 'Unauthorized request!' })
	}
}
