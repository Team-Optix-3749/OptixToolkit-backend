import { Request, Response } from "express";
import { authorize } from "../../utils/firebase";
import { mongoReq } from "../../db/mongo";

export default async function add_hours(req: Request, res: Response) {
  const user = await authorize(req.body.auth, { type: "admin" });

  if (!user || !req.body.uid || !req.body.seconds) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  using userDoc = await mongoReq(async (db) => {
    return db.collection("users").findOne({ uid: user.uid });
  });

  userDoc.ret.seconds += req.body.seconds;

  await userDoc.ret.save();

  try {
    res.status(200).json({ err: false });
  } catch (e) {
    res.status(400).json({ err: "Server Error" });
  }
}
