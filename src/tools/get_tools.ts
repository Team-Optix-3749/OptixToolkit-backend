import { Request, Response } from 'express'
import { Tool, tools } from '../utils/models'
import { getDisplayName, authorize } from '../utils/firebase'

function genPromise (uid: string, dNamePro: Promise<any>) {
	return dNamePro.then(dName => ({uid, dName}))
}

export default async function get_tools(req: Request, res: Response) {
	if (await authorize(req.body.auth)) {
		let toolsRes = (await tools.find()) as any[]
		let newToolsRes: any[] = []
		let allpromises: Promise<any>[] = []
		let done = 0
		toolsRes.forEach(async (tool) => {
			let promises: Promise<any>[] = []
			tool.reservations.forEach(
				(uid) => promises.push(
					genPromise(
						uid, 
						getDisplayName(uid)
					)
				)
			)
			allpromises.concat(promises)
			const cool = await Promise.all(promises)
			let res = [] as string[]
      	let res2 = [] as string[]
			for (var i of cool) {
				res.push(i.dName)
				res2.push(i.uid)
			}
      	tool.reservations_uid = res;
			tool.reservations = res2
			newToolsRes.push(tool)
		})
		await Promise.all(allpromises)
		setTimeout(
			() => res.status(200).json({ tools: newToolsRes, err: false }),
			750
		)
	} else {
		res.status(400).json({ err: 'Unauthorized request!' })
	}
}
