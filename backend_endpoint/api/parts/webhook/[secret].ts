import { NowRequest, NowResponse } from '@vercel/node'
import { WEBHOOK_SECRET } from '../../utils/config'
import { parts, Part } from '../../utils/models'

module.exports = async (req: NowRequest, res: NowResponse) => {
  const { secret } = req.query
  if (secret !== WEBHOOK_SECRET || req.body.description !== "tracker.updated") {
    console.log(secret)
    console.log(secret === WEBHOOK_SECRET)
    console.log("died at first part")
    res.status(200).json({aight: "cool"})
    return
  }
  const { status, tracking_code, carrier } = req.body.result
  if (typeof(status) !== "string" || typeof(tracking_code) !== "string" || typeof(carrier) !== "string") {
    console.log("died at second part")
    res.status(200).json({aight: "cool"})
    return
  }

  console.log("starting that update")

  const r = await parts.updateMany(
    {
      trackingInfo: { 
        trackingId: tracking_code, 
        carrier: carrier
      }
    }, 
    { 
      $set: { 
        status: status
      } 
    }
  )

  console.log(r.n)

  res.status(200).json({aight: "cool"})
}