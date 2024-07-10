import { Request, Response } from "express";
import { tools } from "../../db/models";
import { authorize } from "../../utils/firebase";

export default async function reserve_tool(req: Request, res: Response) {
  let user;
  try {
    user = await authorize(req.body.auth, { type: "certified" });
  } catch (e) {
    res.status(400).json({ err: "User not certified!" });
  }
  if (user) {
    const tool = await tools.findOne({ name: req.body.toolname });
    const { uid } = user;

    if (tool.status == "outOfService") {
      res.status(400).json({ err: "This tool is broken!" });
      return;
    }

    if (tool.reservations.includes(uid)) {
      if (tool.reservations.length <= 1) {
        await tools.updateMany(
          { name: req.body.toolname },
          { $pull: { reservations: uid }, status: "notInUse" }
        );
      } else {
        await tools.updateMany(
          { name: req.body.toolname },
          { $pull: { reservations: uid } }
        );
      }
      res.status(200).json({ err: false });
      return;
    }

    await tools.updateMany(
      { name: req.body.toolname },
      { $push: { reservations: uid }, status: "reserved" }
    );

    res.status(200).json({ err: false });
  } else {
    res.status(400).json({ err: "User not certified!" });
  }
}
