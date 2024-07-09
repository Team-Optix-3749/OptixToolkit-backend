import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { inventory } from '../utils/models'

export default async function postInventoryDecreaseCountByName(req: Request, res: Response) {
    if (await authorize(req.body.auth)) {
        if (typeof req.body.name !== 'string') {
            res.status(400).json({ err: 'Bad Params!' })
            return
        }

        const inventoryRes = await inventory.findOne({ name: req.body.name }).exec()
        
        if (inventoryRes) {
            if (inventoryRes.count > 0) {
                inventoryRes.count -= 1
                await inventoryRes.save()
                res.status(200).json({ message: 'Count decreased by 1', err: false })
            } else {
                res.status(200).json({ message: "The tool you're trying to reserve is out of stock. Wait for someone else to check one in.", err: false })
            }
        } else {
            res.status(404).json({ err: 'Item not found!' })
        }
    } else {
        res.status(400).json({ err: 'Unauthorized request!' })
    }
}
