import { NowRequest, NowResponse } from '@vercel/node'
import { parts, Part } from '../utils/models'
import { authorize } from '../utils/firebase'

function validatePart (body: any): body is Part {
  return typeof(body.uid) === "string" && typeof(body.name) === "string" && typeof(body.link) === "string" && typeof(body.trackingInfo.trackingId) === "string" && typeof(body.trackingInfo.carrier) === "string" &&  typeof(body.description) === "string" && typeof(body.priority) === "number"
}

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (req.body === undefined) {
    res.status(400).json({ err: 'No Body!' })
    return
  }

	if (!await authorize(req.body.auth, { admin: true })) {
    res.status(400).json({ err: 'Unauthorized request!' })
    return
  }

	try {
    if (!validatePart(req.body)) throw new Error('Bad params')
    await parts.create(req.body)
    res.status(200).json({ err: false })
  }
  catch (e) {
    console.log(e)
    res.status(400).json({ err: 'Bad Params!' })
  }
}
