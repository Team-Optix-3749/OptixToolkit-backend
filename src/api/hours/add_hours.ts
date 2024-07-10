import { Request, Response } from "express";
import { users } from "../../db/models";
import { authorize } from "../../utils/firebase";

export default async function add_hours(req: Request, res: Response) {
  const user = await authorize(req.body.auth, { type: "admin" });

  if (!user || !req.body.uid || !req.body.seconds) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  const userDoc = await users.findOne({ uid: req.body.uid });

  userDoc.seconds += req.body.seconds;

  await userDoc.save();

  try {
    res.status(200).json({ err: false });
  } catch (e) {
    res.status(400).json({ err: "Server Error" });
  }
}
