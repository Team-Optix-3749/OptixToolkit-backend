//Config

import { config } from 'dotenv'

config()

console.log(process.env.MONGO_URL, process.env.WEBHOOK_SECRET)

export const { MONGO_URL, WEBHOOK_SECRET } = process.env

//Firebase

import * as admin from 'firebase-admin'

const serviceAccount = require('../secrets/firebaseServiceKey.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
})

interface options {
	admin: boolean
}

export async function authorize(
	token: string,
	options: options = { admin: false }
) {
	if (token == undefined) return false
	try {
		const user = await admin.auth().verifyIdToken(token)
		if (!user.member) throw new Error('Invalid user!')
		if (!user.admin && options.admin) throw new Error('User not Admin!')
		return user
	} catch (e) {
		return false
	}
}

export async function appendDisplayName(
	uid: string,
	object_promise: Promise<any>
) {
	const object = await object_promise

	if (uid === undefined) {
		return {
			...object,
			displayName: 'None',
		}
	}
	try {
		return {
			...object,
			displayName: (await admin.auth().getUser(uid)).displayName,
		}
	} catch (e) {
		return {
			...object,
			displayName: 'None',
		}
	}
}

//Models

import mongoose, { Schema, Document } from 'mongoose'

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

//Tracking

import Easypost from '@easypost/api'

config()

const key = process.env.KEY
const api = new Easypost(key)

export async function trackPackage(
	trackingId: string,
	carrier: string
): Promise<string> {
	const tracker = new api.Tracker({
		tracking_code: trackingId,
		carrier: carrier,
	})

	try {
		const { status } = await tracker.save()
		if (!status) throw new Error('No status')
		return status
	} catch (e) {
		console.log(e)
		throw new Error('Bad Tracking Id')
	}
}
