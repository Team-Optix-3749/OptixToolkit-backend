import { NowRequest, NowResponse } from '@vercel/node'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function reserve_tool(req: NowRequest, res: NowResponse) {
	const user = await authorize(req.body.auth)
	if (user) {
		const tool = await tools.findOne({ name: req.body.toolname })
		const { uid } = user

		if (tool.status == 'outOfService') {
			res.status(400).json({ err: 'This tool is broken!' })
			return
		}

		if (tool.reservations.includes(uid)) {
			if (tool.reservations.length <= 1) {
				await tools.update(
					{ name: req.body.toolname },
					{ $pull: { reservations: uid }, status: 'notInUse' }
				)
			} else {
				await tools.update(
					{ name: req.body.toolname },
					{ $pull: { reservations: uid } }
				)
			}
			res.status(200).json({ err: false })
			return
		}

		await tools.update(
			{ name: req.body.toolname },
			{ $push: { reservations: uid }, status: 'reserved' }
		)

		res.status(200).json({ err: false })
	} else {
		res.status(400).json({ err: 'Unauthorized request!' })
	}
}
