import { Request, Response } from "express";
import { authorize } from "../../utils/firebase";
import { inventory } from "../utils/models";

export default async function get_inventory(req: Request, res: Response) {
  if (await authorize(req.body.auth)) {
    if (typeof req.body.barcodeId !== "string") {
      res.status(400).json({ err: "Bad Params!" });
      return;
    }
    const inventoryRes = await inventory
      .findOne({ barcodeId: req.body.barcodeId })
      .exec();
    res.status(200).json({ inventory: inventoryRes, err: false });
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}
