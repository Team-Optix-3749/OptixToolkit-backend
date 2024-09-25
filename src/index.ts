import express, { Request, Response } from "express";
import cors from "cors";

import parts_add from "./parts/parts_add";
import parts_get from "./parts/parts_get";
import parts_remove from "./parts/parts_remove";
import postTool from "./tools/postTool";
import getToolsByReserverID from "./tools/getToolsByReserverID";
import deleteToolByReserverID from "./tools/deleteToolByReserverID";
import remove_user from "./users/remove_user";
import list_users from "./users/list_users";
import create_user from "./users/create_user";
import certify_user from "./users/certify_user";
import user_db from "./users/user_db";
import uncertify_user from "./users/uncertify_user";
import reimbursement from "./parts/reimbursement";
import parts_webhook from "./parts/parts-webhook";
import check_in from "./hours/check_in";
import add_hours from "./hours/add_hours";
import check_out from "./hours/check_out";
import get_seconds from "./hours/get_seconds";
import get_seconds_cli from "./hours/get_seconds_cli";
import get_meetings from "./hours/get_meetings";
import get_lastcheckin from "./hours/get_lastcheckin";
import getInventoryByBarcodeID from "./inventory/getInventoryByBarcodeID";
import addInventory from "./inventory/addInventory";
import postInventoryDecreaseCountByName from './inventory/postInventoryDecreaseCountByName'
import postInventoryIncreaseCountByName from './inventory/postInventoryIncreaseCountByName'
import getAllInventory from "./inventory/getAllInventory";
import getAllTools from './tools/getAllToolsPrivateMethod';

import { PORT, WEBHOOK_SECRET } from "./utils/config";
import { authenticateUser } from "./utils/firebase";
import {
  delete_settingsCol,
  get_settingsCol,
  get_usersCol,
  push_settingsCol,
  update_settingsCol
} from "./utils/mongo";
import postInventoryCheckTool from "./inventory/postInventoryCheckTool";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
  })
);

app.get('/', (req, res) => {
  res.send('Welcome to the Optix Toolkit API!');
});
// app.use(express.static(__dirname + "/frontend/admin_panel/dist"));

app.post("/api/auth", async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  switch (req.body.endpoint) {
    case "authorize":
      await authenticateUser(req, res);
      break;

    case "get-user":
      await getUserByUid(req, res);
      break;

    default:
      res.status(400).json({ err: "endpoint doesn't exist on '/api/auth'" });
  }
});

app.post("/", async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  switch (req.body.endpoint) {
    case "post-tool":
        postTool(req, res);
        break;

    case "post-inventory-check-tool":
      postInventoryCheckTool(req, res);
      break;

    case "get-tools-by-reserver-id":
        getToolsByReserverID(req, res);
        break;

    case "delete-tool-by-reserver-id":
        deleteToolByReserverID(req, res);
        break;

    case "get-inventory-by-barcode-id":
        getInventoryByBarcodeID(req, res);
        break;

    case "add-inventory":
        addInventory(req, res);
        break;

    case "post-inventory-decrease-count-by-name":
        postInventoryDecreaseCountByName(req, res);
        break;

    case "post-inventory-increase-count-by-name":
        postInventoryIncreaseCountByName(req, res);
        break;
      
    case "parts-get":
      parts_get(req, res);
      break;
    case "parts-add":
      parts_add(req, res);
      break;
    case "parts-remove":
      parts_remove(req, res);
      break;
    case "remove-user":
      remove_user(req, res);
      break;
    case "list-users":
      list_users(req, res);
      break;
    case "create-user":
      create_user(req, res);
      break;
    case "reimbursement":
      reimbursement(req, res);
      break;
    case "certify-user":
      certify_user(req, res);
      break;
    case "uncertify-user":
      uncertify_user(req, res);
      break;
    case "check-out":
      check_out(req, res);
      break;
    case "check-in":
      check_in(req, res);
      break;
    case "get-seconds":
      get_seconds(req, res);
      break;
    case "get-seconds-cli":
      get_seconds_cli(req, res);
      break;
    case "user-db":
      user_db(req, res);
      break;
    case "get-meetings":
      get_meetings(req, res);
      break;
    case "get-lastcheckin":
      get_lastcheckin(req, res);
      break;
    case "add-hours":
      add_hours(req, res);
      break;
    case "getInventoryByBarcodeID":
      getInventoryByBarcodeID(req, res);
      break;
    default:
      res.status(400).json({ err: "endpoint doesn't exist on '/'" });
  }
});

// New GET routes for the methods
app.get("/inventory/:barcodeId", getInventoryByBarcodeID);
app.get("/inventory", getAllInventory);
app.get("/tools/:reserverID", getToolsByReserverID);
app.get("/tools", getAllTools);

// New DELETE route for deleting tool by reserver ID
app.delete("/tools/:reserverID/:name", deleteToolByReserverID);

app.get(`/${WEBHOOK_SECRET}`, parts_webhook);

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}!!`);
});
