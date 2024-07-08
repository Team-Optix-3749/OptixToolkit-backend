import { Request, Response } from "express";
import { authorize } from "../utils/firebase";
import { MONGO_URL } from "../utils/config";
import { settingsCol, usersCol, mongoReq } from "../db/mongo";

export async function get_SettingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  res.status(200).json({
    collection: await settingsCol()
  });
}

export async function get_UsersCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  res.status(200).json({
    collection: await usersCol()
  });
}

export async function push_SettingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  const data = req.body.payload.data;

  if (!data.key || !data.value) res.status(400);

  mongoReq((db) => {
    db.collection("settings").insertOne(data);
  });
}

export async function update_SettingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  const data = req.body.payload;
  mongoReq((db) => {
    db.collection("settings").updateOne(data.filter, { $set: data.update });
  });
}

export async function delete_SettingsCol(req: Request, res: Response) {
  if (req.body === undefined) {
    res.status(400).json({ err: "No Body!" });
    return;
  }
  if (!(await authorize(req.body.auth)))
    return res.status(401).json({ err: "Unauthorized request!" });

  const data = req.body.payload;

  if (!data.filter) res.status(400);

  if (data.many) {
    mongoReq((db) => {
      db.collection("settings").deleteMany(data.filter);
    });
  } else {
    mongoReq((db) => {
      db.collection("settings").deleteOne(data.filter);
    });
  }
}

export async function get_dbUrl(req: Request, res: Response) {
  if (req.body === undefined) return res.status(400).json({ err: "No Body!" });
  if (!(await authorize(req.body.auth, { type: "admin" })))
    return res.status(401).json({ err: "Unauthorized request!" });

  res.status(200).json(MONGO_URL);
}
