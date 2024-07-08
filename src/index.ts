import express from "express";
import cors from "cors";

import { apiHandler } from "./api/apiHandler";

import * as ENV from "./utils/config";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST"
  })
);

app.all("*", async (req, res) => {
  const { pathname } = new URL(req.url);

  // if we migrate to /api/ routes
  // if (pathname.includes("/api/")) {

  // }

  await apiHandler(req, res);
});

app.listen(ENV.PORT, () => {
  console.log(`Listening on PORT ${ENV.PORT}`);
});
