import { Request, Response } from 'express'
import { inventory, Inventory } from '../utils/models'
import { authorize } from '../utils/firebase'

function validateInventory(body: any): body is Inventory {
	return typeof body.name === 'string' && typeof body.barcodeId === 'string' && typeof body.category === 'string' && typeof body.count === 'number'
}

export default async function addInventory(req: Request, res: Response) {

	try {
		if (!validateInventory(req.body)) throw new Error('Bad params')
		await inventory.create({
			name: req.body.name,
			barcodeId: req.body.barcodeId,
			category: req.body.category,
			count: req.body.count,
		})
		res.status(200).json({ err: false })
	} catch (e) {
		console.log(e)
		res.status(400).json({ err: 'Bad Params!' })
	}
}
