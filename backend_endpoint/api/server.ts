import { Tool, tools } from './models'
import express, {} from 'express'
import { NowRequest, NowResponse } from '@vercel/node'

const app = express()

app.get('/get', async (req, res) => {
  const auth_id = req.body.auth
  const tools_collection = await tools.find()
  res.send(tools_collection)
})

app.get('/tracking/:id', async (req, res) => {
  const { id } = req.params

  //get tracking ID here (you CAN use await since this is an ASYNC function)

  res.send('RESPONSE HERE')
})

module.exports = async (req: NowRequest, res: NowResponse) => {
  const tools_collection = await tools.find()
  res.send(tools_collection)
}


/*

FOR USE LATER

async function addTool (tool: Tool) {
  return tools.create(tool)
}

async function removeTool() {

}
*/
