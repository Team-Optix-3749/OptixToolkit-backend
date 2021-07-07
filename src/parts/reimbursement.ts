import { NowRequest, NowResponse } from '@vercel/node'
import { ReimbursementBody, sendEmail } from '../utils/email'
import { authorize } from '../utils/firebase'

function validateBody(body: any): body is ReimbursementBody {
  return typeof(body.personName) === "string" && typeof(body.partName) === "string" && typeof(body.partLink) === "string" && typeof(body.mailingAddress) === "string" && typeof(body.pictureLink) === "string"
}

export default async function reimbursement (req: NowRequest, res: NowResponse) {
  if (!(await authorize(req.body.auth))) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

  if (!validateBody(req.body)) {
    res.status(200).json({ err: 'Bad Params!' })
    return
  }

  await sendEmail(req.body)
  res.status(200).json({done: "done"})
}