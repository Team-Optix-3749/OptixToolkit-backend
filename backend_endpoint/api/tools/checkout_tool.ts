import { NowRequest, NowResponse } from '@vercel/node'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

module.exports = async (req: NowRequest, res: NowResponse) => {
  const user = await authorize(req.body.auth)
  if (user) {
    const tool = await tools.findOne({name: req.body.toolname})
    const { uid } = user

    if (tool.status == "outOfService") {
      res.status(400).json({ err: 'Tool is broken!' })
      return
    }

    if (tool.reservations[0] !== uid) {
      res.status(400).json({ err: 'Not First!' })
      return
    }

    tool.status = "inUse"

    await tool.save()

    res.status(200).json({ err: false })
  }
	else {
    res.status(400).json({ err: 'Unauthorized request!' })
  }
}