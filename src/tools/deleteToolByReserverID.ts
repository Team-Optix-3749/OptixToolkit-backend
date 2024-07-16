import { Request, Response } from 'express'
import { authorize } from '../utils/firebase'
import { tools } from '../utils/models'

export default async function deleteToolsByReserverID(req: Request, res: Response) {
    try {
        const { reserverID, name } = req.params;
        const deleteRes = await tools.findOneAndDelete({ reserverID, name }).exec();
        if (deleteRes) {
            res.status(200).json({ message: 'Tool deleted successfully', err: false });
        } else {
            res.status(404).json({ err: 'Tool not found' });
        }
    } catch (error) {
        res.status(500).json({ err: 'Error deleting tool', details: error.message });
    }
}
