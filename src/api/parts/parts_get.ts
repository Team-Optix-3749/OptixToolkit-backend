import { Request, Response } from "express";
import { appendDisplayName, authorize } from "../../utils/firebase";
import { FullPart, Part, parts } from "../../db/models";

export default async function parts_get(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }

  if (await authorize(req.body.auth)) {
    const result = await parts.find();
    const partsArr = await Promise.all(
      result.map((part) => appendDisplayName(part.uid, part.toObject()))
    );

    res.status(200).json({
      parts: partsArr,
      err: false
    });
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}
