import { Request, Response } from "express";
import { settings, users } from "./models";
import { authorize } from "./firebase";
import { MONGO_URL } from "./config";

export async function get_settingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  const settingsCol = await settings.find({}).lean();
  res.status(200).json({
    collection: settingsCol
  });
}

export async function get_usersCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  const usersCol = await users.find({}).lean();
  res.status(200).json({
    collection: usersCol
  });
}

export async function push_settingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  const data = req.body.payload.data;

  if (!data.key || !data.value) res.status(400);

  settings.collection.insertOne(data);
}

export async function update_settingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  const data = req.body.payload;
  settings.collection.updateOne(data.filter, { $set: data.update });
}

export async function delete_settingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  const data = req.body.payload;

  if (!data.filter) res.status(400);

  if (data.many) {
    settings.collection.deleteMany(data.filter);
  } else {
    settings.collection.deleteOne(data.filter);
  }
}

export async function get_databaseUrl(req: Request, res: Response) {
  if (req.body === undefined) return res.status(400).json({ err: "No Body!" });
  if (!(await authorize(req.body.auth, { type: "admin" })))
    return res.status(401).json({ err: "Unauthorized request!" });

  res.status(200).json(MONGO_URL);
}
