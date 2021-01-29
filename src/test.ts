import { NowRequest, NowResponse } from '@vercel/node'

export default async function test(req: NowRequest, res: NowResponse) {
	console.log('called')
	res.send(req.body.test)
}
