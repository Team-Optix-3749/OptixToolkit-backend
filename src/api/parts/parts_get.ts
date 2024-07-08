//! UNUSED


// import { Request, Response } from "express";
// import { FullPart, parts, Part } from "../utils/models";
// import { authorize, appendDisplayName } from "../../utils/firebase";

// export default async function parts_get(req: Request, res: Response) {
//   if (req.body === undefined) {
//     res.status(400).json({ err: "No Body!" });
//     return;
//   }

//   if (await authorize(req.body.auth)) {
//     const result = await parts.find();
//     const partsArr: FullPart[] = await Promise.all(
//       result.map((part) => appendDisplayName(part.uid, part.toObject()))
//     );

//     res.status(200).json({
//       parts: partsArr,
//       err: false
//     });
//   } else {
//     res.status(400).json({ err: "Unauthorized request!" });
//   }
// }
