import { Request, Response } from "express";
import { tools, Tool } from "../utils/models";
import { authorize } from "../../utils/firebase";

function validateTool(body: any): body is Tool {
  return typeof body.name === "string" && typeof body.category === "string";
}

export default async function add_tool(req: Request, res: Response) {
  if (!(await authorize(req.body.auth, { type: "admin" }))) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  try {
    if (!validateTool(req.body)) throw new Error("Bad params");
    await tools.create({
      name: req.body.name,
      category: req.body.category,
      reservations: [],
      user: "null",
      status: "notInUse"
    });
    res.status(200).json({ err: false });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: "Bad Params!" });
  }
}
