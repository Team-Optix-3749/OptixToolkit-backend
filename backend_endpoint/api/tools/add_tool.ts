import { NowRequest, NowResponse } from '@vercel/node'
import { tools, Tool } from '../utils/models'
import { authorize } from '../utils/firebase'

function validateTool (body: any): body is Tool {
  return typeof(body.name) === "string" && typeof(body.category) === "string"
}

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (!await authorize(req.body.auth, { admin: true })) {
    res.status(400).json({ err: 'Unauthorized request!' })
    return
  }

	try {
    if (!validateTool(req.body)) throw new Error('Bad params')
    await tools.create({
      name: req.body.name,
      category: req.body.category,
      reservations: [],
      user: "null",
      status: "notInUse",
    })
    res.status(200).json({ err: false })
  }
  catch (e) {
    console.log(e)
    res.status(400).json({ err: 'Bad Params!' })
  }
}
