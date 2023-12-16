import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function modify_inventory(req: Request, res: Response) {
	const user = await authorize(req.body.auth)
	if (user && req.body.barcodeId && req.body.count) {
		const inventory = await tools.findOne({ barcodeId: req.body.barcodeId })

		if (inventory) {
            if (inventory.count + req.body.count < 0) {
                res.status(400).json({ err: 'Cannot have negative inventory' })
                return
            }
            else {
                await tools.updateOne(
                    { barcodeId: req.body.barcodeId },
                    { $inc: { count: req.body.count } }
                )
            }
		}
        else {
            res.status(400).json({ err: 'This inventoried tool does not exist' })
        }

		res.status(200).json({ err: false })
	} else {
		res.status(400).json({ err: 'Unauthorized request!' })
	}
}
