import { Request, Response } from "express";
import { authorize } from "../../utils/firebase";
import { tools } from "../utils/models";

export default async function checkout_tool(req: Request, res: Response) {
  const user = await authorize(req.body.auth);
  if (user) {
    const tool = await tools.findOne({ name: req.body.toolname });
    const { uid } = user;

    if (tool.status == "outOfService") {
      res.status(400).json({ err: "This tool is broken!" });
      return;
    }

    if (tool.reservations[0] !== uid) {
      res.status(400).json({ err: "You are not first in line!" });
      return;
    }

    tool.status = "inUse";

    await tool.save();

    res.status(200).json({ err: false });
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}
