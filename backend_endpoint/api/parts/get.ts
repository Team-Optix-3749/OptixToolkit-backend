import { NowRequest, NowResponse } from '@vercel/node'
import { FullPart, parts, Part } from '../utils/models'
import { authorize, appendDisplayName } from '../utils/firebase'

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (await authorize(req.body.auth)) {
    const result = await parts.find()
    const partsArr: FullPart[] = await Promise.all(result.map(part => appendDisplayName(part.uid,part.toObject())))

    res.status(200).json({ 
      parts: partsArr, 
      err: false 
    })
  }
	else {
    res.status(400).json({ err: 'Unauthorized request!' })
  }
}
