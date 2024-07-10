import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function postTool(req: Request, res: Response) {
    const { name, category, reserverID } = req.body

    if (typeof name !== 'string' || typeof category !== 'string' || typeof reserverID !== 'string') {
        res.status(400).json({ err: 'Bad Params!' })
        return
    }

    const newTool = new tools({
        name,
        category,
        reserverID
    })

    try {
        await newTool.save()
        res.status(201).json({ message: 'Tool created successfully', err: false })
    } catch (error) {
        res.status(500).json({ err: 'Error creating tool', details: error.message })
    }
}
