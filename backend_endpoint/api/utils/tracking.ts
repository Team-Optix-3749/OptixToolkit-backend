import { config } from 'dotenv'
import Easypost from '@easypost/api'

config()

const key = process.env.KEY
const api = new Easypost(key);

async function createTracker (trackingId: string, carrier: string): Promise<{ id: string, status: string }> {
  const tracker = new api.Tracker({
    tracking_code: trackingId,
    carrier: carrier,
  });

  try {
    const { id, status } = (await tracker.save())
    return {
      id,
      status
    }
  }
  catch (e) {
    throw new Error("Bad Tracking Id")
  }
}

async function getTracker (trackingNumber: string): Promise<{ tracking_code: string, carrier: string, status: string }> {
  try {
    const { tracking_code, carrier, status } = await api.Tracker.retrieve(trackingNumber)
    return {
      tracking_code,
      carrier,
      status
    }
  }
  catch (e) {
    throw new Error("Bad Tracking Number")
  }
}