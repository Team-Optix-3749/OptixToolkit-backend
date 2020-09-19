import { config } from 'dotenv'

config()

const { MONGO_URL } = process.env
export default MONGO_URL
