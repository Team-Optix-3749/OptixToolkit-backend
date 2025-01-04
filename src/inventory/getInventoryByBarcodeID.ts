import { Request, Response } from 'express'
import { inventory } from '../utils/models'

export default async function getInventoryByBarcodeID(req: Request, res: Response) {
	const barcodeId = req.params.barcodeId;
	if (!barcodeId) {
		res.status(400).json({ err: 'Bad Params!' });
		return;
	}
	const inventoryRes = await inventory.findOne({ barcodeId }).exec();
	res.status(200).json({ inventory: inventoryRes, err: false });
}
