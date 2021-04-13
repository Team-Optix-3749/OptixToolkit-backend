import { NowRequest, NowResponse } from '@vercel/node'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function remove_reservation(req: NowRequest, res: NowResponse) {
	if (!(await authorize(req.body.auth, { admin: true }))) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

  if (typeof(req.body.toolame) !== "string" && typeof(req.body.uid) !== "string") {
    res.status(400).json({ err: 'Bad Params!' })
  }

  try {
    await tools.updateOne(
      { name: req.body.toolname },
      { $push: { reservations: req.body.uid } }
    )
  }
  catch (e) {
    res.status(400).json({err: e.message})
  }

  res.status(200).json({ err: false })
}
