import { NowRequest, NowResponse } from '@vercel/node'
import { FullPart, parts, Part } from '../utils/models'
import { authorize, getDisplayName } from '../utils/firebase'

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (await authorize(req.body.auth)) {
    const result = await parts.find()
    const displayNamePromises: Promise<string>[] = []
    result.forEach(part => {
      displayNamePromises.push(getDisplayName(part.uid))
    })
    const displayNames = await Promise.all(displayNamePromises)

    const partsArr: FullPart[] = []

    for (let i = 0; i < result.length; i++) {
      partsArr.push({
        displayName: displayNames[i],
        ...result[i].toObject(),
      })
    }

    res.status(200).json({ 
      parts: partsArr, 
      err: false 
    })
  }
	else {
    res.status(400).json({ err: 'Unauthorized request!' })
  }
}
