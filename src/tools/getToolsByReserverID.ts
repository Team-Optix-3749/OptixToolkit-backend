import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function getToolsByReserverID(req: Request, res: Response) {
    if (await authorize(req.body.auth)) {
        const { reserverID } = req.body

        if (typeof reserverID !== 'string') {
            res.status(400).json({ err: 'Bad Params!' })
            return
        }

        try {
            const toolsList = await tools.find({ reserverID }).exec()
            res.status(200).json({ tools: toolsList, err: false })
        } catch (error) {
            res.status(500).json({ err: 'Error retrieving tools', details: error.message })
        }
    } else {
        res.status(400).json({ err: 'Unauthorized request!' })
    }
}
