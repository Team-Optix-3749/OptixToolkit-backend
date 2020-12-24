import { config } from 'dotenv'

config()

export const { MONGO_URL, WEBHOOK_SECRET } = process.env