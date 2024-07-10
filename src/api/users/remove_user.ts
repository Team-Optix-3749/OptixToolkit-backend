import { Request, Response } from "express";
import { authorize, removeUser } from "../../utils/firebase";
import { parts, tools } from "../../db/models";

export default async function remove_user(req: Request, res: Response) {
  if (!(await authorize(req.body.auth, { type: "admin" }))) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  try {
    if (typeof req.body.uid !== "string") throw new Error("Bad Params!");

    await removeUser(req.body.uid);

    await tools.updateMany({ $pull: { reservations: req.body.uid } });

    await parts.deleteMany({ uid: req.body.uid });

    res.status(200).json({ err: false });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: "Bad Params!" });
  }
}
