import mongoose, { Schema, Document } from 'mongoose'
import { MONGO_URL } from './config'

mongoose.connect(MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

/* Tools */

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

export const tools = mongoose.model<ToolDoc>('tools', ToolSchema)

/* Parts */

interface PartDoc extends Document {
  name: string
  link: string
  trackingNumber: string
  description: string
  priority: number
}

export interface Part {
	name: string
  link: string
  trackingNumber: string
  description: string
  priority: number
}

const PartSchema: Schema = new Schema({
	name: { type: String, required: true },
  link: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: Number, required: true }
})

export const parts = mongoose.model<PartDoc>('parts', PartSchema)