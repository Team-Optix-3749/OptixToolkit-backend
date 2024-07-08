import { Request, Response } from "express";
import { settings, users } from "../utils/models";
import { authorize } from "../../utils/firebase";

export default async function check_out(req: Request, res: Response) {
  const user = await authorize(req.body.auth);

  if (!user) {
    res.status(400).json({ err: "Unauthorized request!" });
    return;
  }

  const setting = await settings.findOne({ key: "checkOutPassword" });
  if (req.body.password !== setting.value) {
    res.status(400).json({ err: "Check Out Password Wrong! " });
    return;
  }

  const userDoc = await users.findOne({ uid: user.uid });
  const attendanceOverride = await settings.findOne({
    key: "attendanceOverride"
  });

  var date = new Date(Date.now() - 28800000);

  if (userDoc.lastCheckIn === 0) {
    res.status(400).json({ err: "You are not checked in!" });
    return;
  } else if (Date.now() - userDoc.lastCheckIn > 43200000) {
    userDoc.lastCheckIn = 0;
    res
      .status(400)
      .json({
        err: "You did not check out last meeting! Your hours will not be counted."
      });
    return userDoc.save();
  } else if (attendanceOverride.value === "true") {
    userDoc.seconds += Date.now() - userDoc.lastCheckIn;
    userDoc.lastCheckIn = 0;
    userDoc.meetingCount++;
  } else if (
    date.getDay() === 2 ||
    date.getDay() === 3 ||
    date.getDay() === 4
  ) {
    if (date.getHours() >= 15 && date.getHours() <= 18) {
      userDoc.seconds += Date.now() - userDoc.lastCheckIn;
      userDoc.lastCheckIn = 0;
      userDoc.meetingCount++;
    } else {
      userDoc.lastCheckIn = 0;
      res.status(400).json({ err: "Not in meeting time!" });
      return userDoc.save();
    }
  } else if (date.getDay() === 6) {
    if (date.getHours() >= 9 && date.getHours() <= 18) {
      userDoc.seconds += Date.now() - userDoc.lastCheckIn;
      userDoc.lastCheckIn = 0;
      userDoc.meetingCount++;
    } else {
      userDoc.lastCheckIn = 0;
      res.status(400).json({ err: "Not in meeting time!" });
      return userDoc.save();
    }
  } else {
    userDoc.lastCheckIn = 0;
    res.status(400).json({ err: "No meeting today!" });
    return userDoc.save();
  }

  await userDoc.save();

  res.status(200).json({ err: false });
}
