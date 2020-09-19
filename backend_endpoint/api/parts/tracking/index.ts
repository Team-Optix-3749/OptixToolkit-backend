import { NowRequest, NowResponse } from '@vercel/node'



module.exports = async (req: NowRequest, res: NowResponse) => {
  const { tracking_id } = req.body

  //get tracking

  res.send('result')
}