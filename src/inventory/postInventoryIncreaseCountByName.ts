import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { inventory } from '../utils/models'

export default async function postInventoryIncreaseCountByName(req: Request, res: Response) {
    if (await authorize(req.body.auth)) {
        const { name } = req.body

        if (typeof name !== 'string') {
            res.status(400).json({ err: 'Bad Params!' })
            return
        }

        try {
            const inventoryRes = await inventory.findOne({ name }).exec()

            if (inventoryRes) {
                inventoryRes.count += 1
                await inventoryRes.save()
                res.status(200).json({ message: 'Count increased by 1', err: false })
            } else {
                res.status(404).json({ err: 'Item not found!' })
            }
        } catch (error) {
            res.status(500).json({ err: 'Error updating inventory', details: error.message })
        }
    } else {
        res.status(400).json({ err: 'Unauthorized request!' })
    }
}
