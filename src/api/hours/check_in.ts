import { Request, Response } from "express";
import { authorize } from "../../utils/firebase";
import { mongoReq } from "../../db/mongo";

export default async function check_in(req: Request, res: Response) {
  const user = await authorize(req.body.auth);

  if (!user) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  using setting = await mongoReq((db) => {
    return db.collection("settings").findOne({ key: "checkOutPassword" });
  });
  if (req.body.password !== setting.ret.value) {
    res.status(400).json({ err: "Check In Password Wrong! " });
    return;
  }

  using usingUserDoc = await mongoReq(async (db) => {
    return db.collection("users").findOne({ uid: user.uid });
  });
  const userDoc = usingUserDoc.ret;
  const attendanceOverride = await mongoReq((db) => {
    return db.collection("settings").findOne({
      key: "attendanceOverride"
    });
  });

  let date = new Date(Date.now() - 28800000);

  if (userDoc.lastCheckIn !== 0) {
    return res.status(400).json({ err: "You are already checked in!" });
  } else if (attendanceOverride.ret.value === "true") {
    userDoc.lastCheckIn = Date.now();
  } else if (
    date.getDay() === 2 ||
    date.getDay() === 3 ||
    date.getDay() === 4
  ) {
    if (date.getHours() >= 15 && date.getHours() <= 18) {
      userDoc.lastCheckIn = Date.now();
    } else {
      res.status(400).json({ err: "Not in meeting time!" });
      return;
    }
  } else if (date.getDay() === 6 && false) {
    if (date.getHours() >= 9 && date.getHours() <= 18) {
      userDoc.lastCheckIn = Date.now();
    } else {
      res.status(400).json({ err: "Not in meeting time!" });
      return;
    }
  } else {
    res.status(400).json({ err: "No meeting today!" });
    return;
  }

  await userDoc.save();

  try {
    res.status(200).json({ err: false });
  } catch (e) {
    res.status(400).json({ err: "Server Error" });
  }
}
