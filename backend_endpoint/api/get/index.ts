import { Tool, tools } from '../utils/models'
import { NowRequest, NowResponse } from '@vercel/node'

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
