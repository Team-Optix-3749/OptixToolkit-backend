import { Request, Response } from "express";
import { authorize } from "../../utils/firebase";
import { tools } from "../utils/models";

export default async function change_tool_status(req: Request, res: Response) {
  if (await authorize(req.body.auth, { type: "admin" })) {
    const tool = await tools.findOne({ name: req.body.toolname });

    tool.status = req.body.newtoolstatus;

    await tool.save();

    res.status(200).json({ err: false });
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}
