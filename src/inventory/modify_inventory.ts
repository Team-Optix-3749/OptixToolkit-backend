import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { inventory } from '../utils/models'

export default async function modify_inventory(req: Request, res: Response) {
	const user = await authorize(req.body.auth)
	if (user && req.body.barcodeId && req.body.count) {
		const inventoryTool = await inventory.findOne({ barcodeId: req.body.barcodeId })

		if (inventoryTool) {
            if (inventoryTool.count + req.body.count < 0) {
                res.status(400).json({ err: 'Cannot have negative inventory' })
                return
            }
            else {
                await inventory.updateOne(
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
