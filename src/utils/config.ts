import { config } from 'dotenv'

config()

console.log(process.env.MONGO_URL, process.env.WEBHOOK_SECRET)

export const { MONGO_URL, WEBHOOK_SECRET } = process.env
