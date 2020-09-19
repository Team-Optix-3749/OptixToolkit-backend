import mongoose, { Schema, Document } from 'mongoose'
import { MONGO_URL } from './config'

mongoose.connect(MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

interface ToolDoc extends Document {
	name: string
	count: number
}

export interface Tool {
	name: string
	count: number
}

const ToolSchema: Schema = new Schema({
	name: { type: String, required: true },
	count: { type: Number, required: true },
})

const tools = mongoose.model<ToolDoc>('tools', ToolSchema)

export { tools }
