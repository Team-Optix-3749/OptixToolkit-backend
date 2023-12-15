import { Request, Response } from "express";
import { settings, users } from "../utils/models";
import { authorize } from "../utils/firebase";

export async function get_settingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }

  if (await authorize(req.body.auth)) {
    const settingsCol = await settings.find().lean();
    res.status(200).json({
      collection: settingsCol
    });
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}

export async function get_usersCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }

  if (await authorize(req.body.auth)) {
    const usersCol = await users.find().lean();
    res.status(200).json({
      collection: usersCol
    });
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}

export async function push_settingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }

  if (await authorize(req.body.auth)) {
    const data = req.body.payload.data;

    if (!data.key || !!data.value)  res.status(400).json({ err: "Unauthorized request!" });

    settings.collection.insertOne(data);
  } else {
    res.status(400).json({ err: "Unauthorized request!" });
  }
}
