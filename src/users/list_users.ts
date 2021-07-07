import { NowRequest, NowResponse } from '@vercel/node'
import { authorize, listUsers } from '../utils/firebase'



export default async function list_users(req: NowRequest, res: NowResponse) {
	if (!(await authorize(req.body.auth, { admin: true }))) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

	try {		
		res.status(200).json({ 
      err: false, 
      users: (await listUsers()).users.map(u => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName
      })) 
    })
	} catch (e) {
		console.log(e)
		res.status(400).json({ err: 'Bad Params!' })
	}
}
