import { Request, Response } from "express";
import { authorize } from "../../utils/firebase";
import { mongoReq } from "../../db/mongo";

export default async function get_meetings(req: Request, res: Response) {
  const user = await authorize(req.body.auth);

  if (!user) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  try {
    using userDoc = await mongoReq(async (db) => {
      return db.collection("users").findOne({ uid: user.uid });
    });
    res.status(200).json({ count: userDoc.ret.meetingCount, err: false });
  } catch (e) {
    res.status(400).json({ err: "Server Error" });
  }
}
