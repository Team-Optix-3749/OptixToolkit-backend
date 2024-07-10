import { Request, Response } from "express";
import { tools } from "../../db/models";
import { authorize } from "../../utils/firebase";

export default async function return_tool(req: Request, res: Response) {
  const user = await authorize(req.body.auth);
  if (user) {
    const tool = await tools.findOne({ name: req.body.toolname });
    const { uid } = user;

    if (tool.status !== "inUse" || tool.reservations[0] !== uid) {
      res.status(400).json({ err: "You are not using this tool!" });
      return;
    }

    if (tool.reservations.length === 1) {
      await tools.updateMany(
        { name: req.body.toolname },
        { $pull: { reservations: uid }, status: "notInUse" }
      );
    } else {
      await tools.updateMany(
        { name: req.body.toolname },
        { $pull: { reservations: uid } }
      );
    }

    res.status(200).json({ err: false });
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}
