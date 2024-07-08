import { Request, Response } from "express";

import parts_add from "./parts/parts_add";
import parts_get from "./parts/parts_get";
import parts_remove from "./parts/parts_remove";
import add_tool from "./tools/add_tool";
import remove_tool from "./tools/remove_tool";
import change_tool_status from "./tools/change_tool_status";
import checkout_tool from "./tools/checkout_tool";
import get_category from "./tools/get_category";
import get_tool from "./tools/get_tool";
import get_tools from "./tools/get_tools";
import reserve_tool from "./tools/reserve_tool";
import remove_reservation from "./tools/remove_reservation";
import return_tool from "./tools/return_tool";
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
import get_inventory from "./inventory/get_inventory";
import add_inventory from "./inventory/add_inventory";
import modify_inventory from "./inventory/modify_inventory";
import { authenticateUser, get_user_data } from "../utils/firebase";

import * as ENV from "../utils/config";

export async function apiHandler(req: Request, res: Response) {
  const pathname = req.path;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  switch (req.method) {
    case "GET":
      return GET(req, res);

    case "POST":
      return POST(req, res);

    default:
      return res.status(405).json("Method Not Allowed");
  }
}

async function POST(req: Request, res: Response) {
  const pathname = req.path;
  const body = req.body;

  if (pathname === "/api/db") {
    switch (req.body.endpoint) {
      case "get-user-data":
        return get_user_data(req, res);

      default:
        return res
          .status(400)
          .json(`${body.endpoint} doesn't exist on /api/db`);
    }
  }

  if (pathname === "/api/auth") {
    switch (req.body.endpoint) {
      case "authorize":
        return authenticateUser(req, res);

      default:
        return res.status(400).json(`${body.endpoint} doesn't exist on /`);
    }
  }

  switch (body.endpoint) {
    case "parts-get":
      return parts_get(req, res);

    case "parts-add":
      return parts_add(req, res);

    case "parts-remove":
      return parts_remove(req, res);

    case "add-tool":
      return add_tool(req, res);

    case "remove-tool":
      return remove_tool(req, res);

    case "remove-reservation":
      return remove_reservation(req, res);

    case "remove-user":
      return remove_user(req, res);

    case "list-users":
      return list_users(req, res);

    case "create-user":
      return create_user(req, res);

    case "change-tool-status":
      return change_tool_status(req, res);

    case "checkout-tool":
      return checkout_tool(req, res);

    case "get-category":
      return get_category(req, res);

    case "get-tool":
      return get_tool(req, res);

    case "get-tools":
      return get_tools(req, res);

    case "reserve-tool":
      return reserve_tool(req, res);

    case "return-tool":
      return return_tool(req, res);

    case "reimbursement":
      return reimbursement(req, res);

    case "certify-user":
      return certify_user(req, res);

    case "uncertify-user":
      return uncertify_user(req, res);

    case "check-out":
      return check_out(req, res);

    case "check-in":
      return check_in(req, res);

    case "get-seconds":
      return get_seconds(req, res);

    case "get-seconds-cli":
      return get_seconds_cli(req, res);

    case "user-db":
      return user_db(req, res);

    case "get-meetings":
      return get_meetings(req, res);

    case "get-lastcheckin":
      return get_lastcheckin(req, res);

    case "add-hours":
      return add_hours(req, res);

    case "get-inventory":
      return get_inventory(req, res);

    case "add-inventory":
      return add_inventory(req, res);

    case "modify-inventory":
      return modify_inventory(req, res);

    case "get-inventory":
      return get_inventory(req, res);

    case "add-inventory":
      return add_inventory(req, res);

    case "modify-inventory":
      return modify_inventory(req, res);

    default:
      res.status(400).json(`${body.endpoint} doesn't exist on /`);
  }
}

async function GET(req: Request, res: Response) {
  const pathname = req.path;
  const body = req.body;

  //nothing useful here rn
  switch (body.endpoint) {
    case `${ENV.WEBHOOK_SECRET}`:
      return parts_webhook(req, res);
    default:
      return res.json({
        requestUrl: req.url,
        method: "GET",
        pathname: pathname
      });
  }
}
