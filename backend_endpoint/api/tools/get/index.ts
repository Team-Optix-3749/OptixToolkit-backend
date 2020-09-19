import { Tool, tools } from '../../utils/models'
import { NowRequest, NowResponse } from '@vercel/node'
import { request } from 'express'
import * as admin from 'firebase-admin';
const serviceAccount = require('../../secrets/firebaseServiceKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = async (req: NowRequest, res: NowResponse) => {
  try {
    const { auth } = req.body
    const user = await admin.auth().verifyIdToken(auth)
    if (!user.member) throw new Error('U suck')
  }
  catch (e) {
    console.log(e)
    res.status(400).json({'err' : 'Unauthorized you gumbo'})
    return
  }

  const tools_res = await tools.find()

  res.status(200).json({ tools_res })
}


/*

FOR USE LATER

async function addTool (tool: Tool) {
  return tools.create(tool)
}

async function removeTool() {

}
*/
