import { NowRequest, NowResponse } from '@vercel/node'
import { tools } from '../../utils/models'
import authorize from '../../utils/authorize'

module.exports = async (req: NowRequest, res: NowResponse) => {
	if (!await authorize(req.body.auth)) {
    res.status(400).json({ err: 'Unauthorized request!' })
    return
  }

	try {
    if (req.body.name === undefined || req.body.count === undefined || typeof(req.body.name) !== "string" || typeof(req.body.count) !== "number") throw new Error('Bad params')
    console.log("creating tool")
    await tools.create({
      name: req.body.name,
      count: req.body.count
    })
    console.log("tool created")
    res.status(200).json({ err: false })
  }
  catch (e) {
    console.log(e)
    res.status(400).json({ err: 'Bad Params!' })
  }
}
