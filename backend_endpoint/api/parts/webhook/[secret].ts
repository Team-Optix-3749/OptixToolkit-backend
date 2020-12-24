import { NowRequest, NowResponse } from '@vercel/node'
import { WEBHOOK_SECRET } from '../../utils/config'
import { parts, Part } from '../../utils/models'

module.exports = async (req: NowRequest, res: NowResponse) => {
  const { secret } = req.query
  if (secret !== WEBHOOK_SECRET || req.body.description !== "tracker.updated") {
    console.log(secret === WEBHOOK_SECRET)
    console.log("died at first part")
    res.status(200)
    return
  }
  const { status, tracking_code, carrier } = req.body
  if (typeof(status) !== "string" || typeof(tracking_code) !== "string" || typeof(carrier) !== "string") {
    console.log("died at second part")
    res.status(200)
    return
  }

  await parts.updateMany(
    {
      trackingInfo: { 
        trackingId: tracking_code, 
        carrier: carrier
      }
    }, 
    { 
      $set: { 
        "trackingInfo.status": status
      } 
    }
  )

  res.status(200)
}