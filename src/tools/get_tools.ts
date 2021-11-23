import { Request, Response } from 'express'
import { Tool, tools } from '../utils/models'
import { getDisplayName, authorize } from '../utils/firebase'

export default async function get_tools(req: Request, res: Response) {
	if (await authorize(req.body.auth)) {
		let toolsRes = await tools.find()
		let newToolsRes: Tool[] = []
		let allpromises: Promise<any>[] = []
		let done = 0
		toolsRes.forEach(async (tool) => {
			let promises: Promise<any>[] = []
			tool.reservations.forEach((uid) => promises.push({uid: uid, dName: getDisplayName(uid)}))
			allpromises.concat(promises)
			const cool = await Promise.all(promises)
			tool.reservations = []
			(tool as any).reservations_uid = []
			for (var i of cool) {
				tool.reservations.push(i.dName)
				(tool as any).reservations_uid.push(i.uid))
			}
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
