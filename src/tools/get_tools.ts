import { Request, Response } from 'express'
import { Tool, tools } from '../utils/models'
import { getDisplayName, authorize } from '../utils/firebase'

export default async function get_tools(req: Request, res: Response) {
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
