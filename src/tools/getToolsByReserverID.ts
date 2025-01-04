import { Request, Response } from 'express'
import { tools } from '../utils/models'

export default async function getToolsByReserverID(req: Request, res: Response) {
    try {
        const reserverID = req.params.reserverID;
        const toolsRes = await tools.find({ reserverID }).exec();
        res.status(200).json({ tools: toolsRes, err: false });
    } catch (error) {
        res.status(500).json({ err: 'Error retrieving tools', details: error.message });
    }
}
