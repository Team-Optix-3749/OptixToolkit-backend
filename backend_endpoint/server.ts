import { Tool, tools } from './models'
import express, {} from 'express'

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

app.listen(process.env.PORT || 3000)


/*

FOR USE LATER

async function addTool (tool: Tool) {
  return tools.create(tool)
}

async function removeTool() {

}
*/
