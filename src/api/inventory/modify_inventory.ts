import { Request, Response } from "express";
import { authorize } from "../../utils/firebase";
import { inventory } from "../utils/models";

export default async function modify_inventory(req: Request, res: Response) {
  const user = await authorize(req.body.auth);
  if (user && req.body.barcodeId && (req.body.status || req.body.location)) {
    const inventoryTool = await inventory
      .findOne({ barcodeId: req.body.barcodeId })
      .exec();

    if (inventoryTool) {
      if (req.body.status) inventoryTool.status = req.body.status;
      if (req.body.location) inventoryTool.location = req.body.location;
      const newInventory = await inventoryTool.save();
      res.status(200).json({ err: false, inventory: newInventory });
    } else {
      res.status(400).json({ err: "This inventoried tool does not exist" });
    }
  } else {
    res.status(400).json({ err: "Unauthorized request or no changes made!" });
  }
}
