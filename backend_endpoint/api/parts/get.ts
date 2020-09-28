import { NowRequest, NowResponse } from '@vercel/node'
import { parts } from '../utils/models'
import authorize from '../utils/authorize'

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (await authorize(req.body.auth)) {
    const result = await parts.find()
	  res.status(200).json({ tools: result, err: false })
  }
	else {
    res.status(400).json({ err: 'Unauthorized request!' })
  }
}
