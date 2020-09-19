import { Tool, tools } from './models'
import express, {} from 'express'

const app = express()

app.get('/get', async (req, res) => {
  const tools_collection = await tools.find()
  res.send(tools_collection)
})


app.listen(process.env.PORT || 3000)


/*

FOR USE LATER

async function addTool (tool: Tool) {
  return tools.create(tool)
}

async function removeTool() {

}
*/
