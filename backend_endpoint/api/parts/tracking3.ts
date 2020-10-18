import Easypost from '@easypost/api'
import { config } from 'dotenv'

config()

const key = process.env.KEY
const tracker = 'TRACKING_ID_HERE'
const api = new Easypost(key);

api.Tracker.retrieve(tracker).then(status => {
  console.log("status: " + status.status)
});
