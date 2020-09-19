import { Tool, tools } from './models'

async function getTools () {
  const tools_collection = await tools.find()
  return tools_collection
}

async function addTool (tool: Tool) {
  return tools.create(tool)
}

async function removeTool() {

}

async function main () {
  await addTool({name: 'Saw', count: 3})
  console.log(await getTools())
}

main()