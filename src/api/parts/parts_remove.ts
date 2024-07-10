import { Request, Response } from "express";
import { authorize } from "../../utils/firebase";
import { Part, parts } from "../../db/models";

export default async function parts_remove(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }

  if (!(await authorize(req.body.auth, { type: "admin" }))) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  try {
    console.log("REQ BODY BELOW");
    console.log(req.body);
    if (typeof req.body.id !== "string") {
      throw new Error("Bad params");
    }
    await parts.deleteOne({ _id: req.body.id as String });
    res.status(200).json({ err: false });
  } catch (e) {
    res.status(400).json({ err: e.message });
  }
}
