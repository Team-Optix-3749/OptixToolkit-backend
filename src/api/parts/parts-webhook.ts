import { Request, Response } from "express";
import { WEBHOOK_SECRET } from "../../utils/config";
import { parts, Part } from "../utils/models";

export default async function (req: Request, res: Response) {
  if (req.body.description !== "tracker.updated") {
    console.log("died at first part");
    res.status(200).json({ aight: "cool" });
    return;
  }
  const { status, tracking_code, carrier } = req.body.result;
  if (
    typeof status !== "string" ||
    typeof tracking_code !== "string" ||
    typeof carrier !== "string"
  ) {
    console.log("died at second part");
    res.status(200).json({ aight: "cool" });
    return;
  }

  console.log("starting that update");

  const r = await parts.updateMany(
    {
      trackingInfo: {
        trackingId: tracking_code,
        carrier: carrier
      }
    },
    {
      $set: {
        status: status
      }
    }
  );

  console.log(r);

  res.status(200).json({ aight: "cool" });
}
