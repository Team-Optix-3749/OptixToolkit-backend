import { Request, Response } from "express";
import { tools } from "../../db/models";
import { authorize } from "../../utils/firebase";

export default async function get_tool(req: Request, res: Response) {
  if (await authorize(req.body.auth)) {
    if (typeof req.body.name !== "string") {
      res.status(400).json({ err: "Bad Params!" });
      return;
    }
    const toolRes = await tools.findOne({ name: req.body.name });
    res.status(200).json({ tool: toolRes, err: false });
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}
