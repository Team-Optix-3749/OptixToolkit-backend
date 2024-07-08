import { Request, Response } from "express";
import { parts, Part } from "../utils/models";
import { authorize } from "../../utils/firebase";
import { trackPackage } from "../../utils/tracking";

function validatePart(body: any): body is Part {
  return (
    typeof body.uid === "string" &&
    typeof body.name === "string" &&
    typeof body.link === "string" &&
    typeof body.trackingInfo.trackingId === "string" &&
    typeof body.trackingInfo.carrier === "string" &&
    typeof body.description === "string" &&
    typeof body.priority === "number"
  );
}

export default async function parts_add(req: Request, res: Response) {
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
    if (!validatePart(req.body)) {
      throw new Error("Bad params");
    }
    req.body.status = await trackPackage(
      req.body.trackingInfo.trackingId,
      req.body.trackingInfo.carrier
    );
    await parts.create(req.body);
    res.status(200).json({ err: false });
  } catch (e) {
    res.status(400).json({ err: e.message });
  }
}
