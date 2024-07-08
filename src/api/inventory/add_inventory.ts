import { Request, Response } from "express";
import { inventory, Inventory } from "../utils/models";
import { authorize } from "../../utils/firebase";

function validateInventory(body: any): body is Inventory {
  return (
    typeof body.name === "string" &&
    typeof body.barcodeId === "string" &&
    typeof body.count === "number"
  );
}

export default async function add_inventory(req: Request, res: Response) {
  if (!(await authorize(req.body.auth, { type: "admin" }))) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  try {
    if (!validateInventory(req.body)) throw new Error("Bad params");
    await inventory.create({
      name: req.body.name,
      count: req.body.count,
      barcodeId: req.body.barcodeId,
      description: req.body.description
    });
    res.status(200).json({ err: false });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: "Bad Params!" });
  }
}
