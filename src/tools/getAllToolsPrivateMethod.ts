import { Request, Response } from 'express'
import { tools } from '../utils/models'

export default async function getAllTools(req: Request, res: Response) {
    try {
        const toolsRes = await tools.find({}).exec()
        res.status(200).json({ tools: toolsRes, err: false })
    } catch (error) {
        res.status(500).json({ err: 'Internal server error!' })
    }
}
