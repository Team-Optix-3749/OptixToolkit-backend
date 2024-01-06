import { Request, Response } from "express";
import { authorize, listUsers } from "../utils/firebase";

export default async function list_users(req: Request, res: Response) {
  if (!(await authorize(req.body.auth, { type: "admin" }))) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  try {
    res.status(200).json({
      err: false,
      users: (await listUsers()).users.map((u) => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        certified: u.customClaims?.certified === true
      }))
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: "Bad Params!" });
  }
}
