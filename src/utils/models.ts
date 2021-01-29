import mongoose, { Schema, Document } from 'mongoose'
import { MONGO_URL } from './config'


mongoose.connect(MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

/* Tools */

export interface Tool {
	name: string
	category: string
	status: string
	reservations: string[]
	user: String
}

interface ToolDoc extends Document, Tool {}

const ToolSchema: Schema = new Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },
	reservations: { type: [String], required: true },
	status: { type: String, required: true },
	user: { type: String, required: true },
})

export const tools = mongoose.model<ToolDoc>('tools', ToolSchema)

/* Parts */

export interface Part {
	uid: string
	name: string
	link: string
	trackingInfo: {
		trackingId: string
		carrier: string
	}
	description: string
	priority: number
	status: string
}

interface PartDoc extends Document, Part {}

export interface FullPart extends Part {
	displayName: string
}

const PartSchema: Schema = new Schema({
	uid: { type: String, required: true },
	name: { type: String, required: true },
	link: { type: String, required: true },
	trackingInfo: {
		trackingId: { type: String, required: true },
		carrier: { type: String, required: true },
	},
	description: { type: String, required: true },
	priority: { type: Number, required: true },
	status: { type: String, required: true },
})

export const parts = mongoose.model<PartDoc>('parts', PartSchema)
