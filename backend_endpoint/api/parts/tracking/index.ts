import { NowRequest, NowResponse } from "@vercel/node";

const tracker = require("delivery-tracker");

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (
    req.body === undefined ||
    req.body.tracking_id === undefined ||
    req.body.courier_name === undefined
  ) {
    console.log(req.body);
    res.send(
      JSON.stringify({
        err: "Invalid request: please specify tracking_id AND courier_name!",
      })
    );
    return;
  }

  const { tracking_id, courier_name } = req.body;
  const courier = tracker.courier(
    tracker.COURIER[`${courier_name}`.toUpperCase()].CODE
  );

  let result;
  courier.trace(tracking_id, function (err, res) {
    result = res;
  });

  console.log(result);
  res.send(result);
};
