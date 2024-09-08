import { Request, Response } from 'express';
import { inventory } from '../utils/models';

export default async function postInventoryCheckTool(req: Request, res: Response) {
    try {

        // Extract barcodeId from the request body, regardless of other content
        const { barcodeId } = req.body;

        // Check if barcodeId exists
        if (!barcodeId) {
            return res.status(400).json({ message: 'barcodeId is required' });
        }

        // Query the inventory for a matching barcodeId
        const existingItem = await inventory.findOne({ where: { barcodeId } });

        // If the item doesn't exist, return a 404
        if (!existingItem) {
            return res.status(404).json({ message: 'Item not found in inventory' });
        }

        // Return the found item
        return res.status(200).json(existingItem);
    } catch (error) {
        console.error('Error checking inventory:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
