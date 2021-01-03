import { NowRequest, NowResponse } from '@vercel/node'
import { authorize } from '../utils/utils'
import { tools } from '../utils/utils'

module.exports = async (req: NowRequest, res: NowResponse) => {
	const user = await authorize(req.body.auth)
	if (user) {
		const tool = await tools.findOne({ name: req.body.toolname })
		const { uid } = user

		if (tool.status == 'outOfService') {
			res.status(400).json({ err: 'Tool is broken!' })
			return
		}

    if (tool.reservations.includes(uid)) {
      res.status(400).json({ err: 'You have already reserved this tool' })
      return
    }

    await tools.update(
      { name: req.body.toolname },
      { $push: { reservations: uid }, status: 'reserved' }
    )
		      
    res.status(200).json({ err: false })
  }
	else {
    res.status(400).json({ err: 'Unauthorized request!' })
  }
}
