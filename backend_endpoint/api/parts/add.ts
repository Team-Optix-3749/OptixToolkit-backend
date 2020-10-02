import { NowRequest, NowResponse } from '@vercel/node'
import { parts, Part } from '../utils/models'
import authorize from '../utils/authorize'

function validatePart (body: any): body is Part {
  return typeof(body.uid) === "string" && typeof(body.name) === "string" && typeof(body.link) === "string" && typeof(body.trackingNumber) === "string" && typeof(body.description) === "string" && typeof(body.priority) === "number"
}

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (!await authorize(req.body.auth, { admin: true })) {
    res.status(400).json({ err: 'Unauthorized request!' })
    return
  }

	try {
    if (!validatePart(req.body)) throw new Error('Bad params')
    await parts.create({
      uid: req.body.uid,
      name: req.body.name,
      link: req.body.link,
      trackingNumber: req.body.trackingNumber,
      description: req.body.description,
      priority: req.body.priority
    })
    res.status(200).json({ err: false })
  }
  catch (e) {
    console.log(e)
    res.status(400).json({ err: 'Bad Params!' })
  }
}
