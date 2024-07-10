import mongoose, { Schema, Document } from "mongoose";
import { MONGO_URL } from "../utils/config";

mongoose.connect(MONGO_URL);

/* Settings */
export interface Setting {
  key: string;
  value: string | null;
}

const SettingSchema: Schema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true, nullable: true }
});

/* Users */
export interface User {
  uid: string;
  seconds: number;
  lastCheckIn: number | null;
  meetingCount: number;
}

const UserSchema: Schema = new Schema({
  uid: { type: String, required: true },
  seconds: { type: Number, required: true },
  lastCheckIn: { type: Number, required: true, nullable: true },
  meetingCount: { type: Number, required: true }
});

/* Tools */

export interface Tool {
  name: string;
  category: string;
  status: string;
  reservations: string[];
  user: String;
}

const ToolSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  reservations: { type: [String], required: true },
  status: { type: String, required: true },
  user: { type: String, required: true }
});

/* Parts */

export interface Part {
  uid: string;
  name: string;
  link: string;
  trackingInfo: {
    trackingId: string;
    carrier: string;
  };
  description: string;
  priority: number;
  status: string;
}

export interface FullPart extends Part {
  displayName: string;
}

const PartSchema: Schema = new Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  link: { type: String, required: true },
  trackingInfo: {
    trackingId: { type: String, required: true },
    carrier: { type: String, required: true }
  },
  description: { type: String, required: true },
  priority: { type: Number, required: true },
  status: { type: String, required: true }
});

/* Inventory */

export interface Inventory {
  name: string;
  description: string;
  count: number;
  barcodeId: string;
  status: string;
  location: string;
}

const InventorySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  count: { type: Number, required: true },
  barcodeId: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true }
});

interface SettingDoc extends Document, Setting {}
interface UserDoc extends Document, User {}
interface ToolDoc extends Document, Tool {}
interface PartDoc extends Document, Part {}
interface InventoryDoc extends Document, Inventory {}

export const inventory = mongoose.model<InventoryDoc>(
  "inventory",
  InventorySchema
);
export const settings = mongoose.model<SettingDoc>("settings", SettingSchema);
export const users = mongoose.model<UserDoc>("users", UserSchema);
export const tools = mongoose.model<ToolDoc>("tools", ToolSchema);
export const parts = mongoose.model<PartDoc>("parts", PartSchema);
