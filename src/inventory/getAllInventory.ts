import { Request, Response } from 'express';
import { inventory } from '../utils/models';

export default async function getAllInventory(req: Request, res: Response) {
    try {
        const inventoryRes = await inventory.find().exec();
        res.status(200).json({ inventory: inventoryRes, err: false });
    } catch (error) {
        res.status(500).json({ err: 'Error retrieving inventory', details: error.message });
    }
}