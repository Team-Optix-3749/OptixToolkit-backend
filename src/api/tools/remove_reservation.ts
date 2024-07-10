import { Request, Response } from "express";
import { tools } from "../../db/models";
import { authorize } from "../../utils/firebase";

export default async function remove_reservation(req: Request, res: Response) {
  if (!(await authorize(req.body.auth, { type: "admin" }))) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  if (
    typeof req.body.toolame !== "string" &&
    typeof req.body.uid !== "string"
  ) {
    res.status(400).json({ err: "Bad Params!" });
  }

  try {
    await tools.updateOne(
      { name: req.body.toolname },
      { $pull: { reservations: req.body.uid } }
    );

    const theTool = await tools.findOne({ name: req.body.toolname });

    if (theTool?.reservations?.length === 0) {
      theTool.status = "notInUse";
      await theTool.save();
    }
  } catch (e) {
    res.status(400).json({ err: e.message });
  }

  res.status(200).json({ err: false });
}
