import { NowRequest, NowResponse } from '@vercel/node'
import { authorize } from '../utils/utils'
import { tools } from '../utils/utils'

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (await authorize(req.body.auth, { admin: true })) {
    const tool = await tools.findOne({name: req.body.toolname})
    
    tool.status = "outOfService"

    await tool.save()

    res.status(200).json({ err: false })
  }
	else {
    res.status(400).json({ err: 'Unauthorized request!' })
  }
}