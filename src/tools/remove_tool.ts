import { NowRequest, NowResponse } from '@vercel/node'
import { tools } from '../utils/models'
import { authorize } from '../utils/firebase'
import { trackPackage } from '../utils/tracking'

export default async function remove_tool(req: NowRequest, res: NowResponse) {
	if (req.body === undefined) {
		res.status(400).json({ err: 'No Body!' })
		return
	}

	if (!(await authorize(req.body.auth, { admin: true }))) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	try {
		console.log('REQ BODY BELOW')
		console.log(req.body)
		if (typeof(req.body.id) !== "string") {
			throw new Error('Bad params')
		}
		await tools.deleteOne({_id: (req.body.id as String)})
		res.status(200).json({ err: false })
	} catch (e) {
		res.status(400).json({ err: e.message })
	}
}
