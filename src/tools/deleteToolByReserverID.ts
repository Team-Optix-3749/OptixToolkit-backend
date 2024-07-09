import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function deleteToolsByReserverID(req: Request, res: Response) {
    if (await authorize(req.body.auth)) {
        const { name, reserverID } = req.body

        if (typeof name !== 'string' || typeof reserverID !== 'string') {
            res.status(400).json({ err: 'Bad Params!' })
            return
        }

        try {
            const tool = await tools.findOneAndDelete({ name, reserverID }).exec()

            if (tool) {
                res.status(200).json({ message: 'Tool deleted successfully', err: false })
            } else {
                res.status(404).json({ err: 'Tool not found' })
            }
        } catch (error) {
            res.status(500).json({ err: 'Error deleting tool', details: error.message })
        }
    } else {
        res.status(400).json({ err: 'Unauthorized request!' })
    }
}
