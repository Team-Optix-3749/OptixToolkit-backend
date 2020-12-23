import { config } from 'dotenv'
import Easypost from '@easypost/api'

config()

const key = process.env.KEY
const api = new Easypost(key);

export async function trackPackage (trackingId: string, carrier: string): Promise<string> {
  const tracker = new api.Tracker({
    tracking_code: trackingId,
    carrier: carrier,
  });

  try {
    const { status } = (await tracker.save())
    if (!status) throw new Error("No status")
    return status
  }
  catch (e) {
    console.log(e)
    throw new Error("Bad Tracking Id")
  }
}


export async function appendTrackingInfo (object_promise: Promise<any>, trackingId: string, carrier: string) {
  const object = await object_promise

  try {
    const status = await trackPackage(trackingId,carrier)
    return {
      ...object,
      status
    }
  }
  catch (e) {
    console.log(e)
    return {
      ...object,
      status: 'Not Availible'
    }
  }
}