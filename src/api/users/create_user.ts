import { Request, Response } from "express";
import { addUser, authorize } from "../../utils/firebase";

export default async function add_tool(req: Request, res: Response) {
  if (!req.body) {
    res.status(400).json({ err: "Bad Params!" });
    return;
  }

  if (!(await authorize(req.body.auth, { type: "admin" }))) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  try {
    if (
      typeof req.body.name !== "string" &&
      typeof req.body.email !== "string" &&
      typeof req.body.admin !== "boolean"
    )
      throw new Error("Bad Params!");

    await addUser(req.body.name, req.body.email, req.body.admin);

    res.status(200).json({ err: false });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: "Bad Params!" });
  }
}
