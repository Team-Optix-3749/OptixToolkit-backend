import { NowRequest, NowResponse } from '@vercel/node'
import parts_add from '../../src/parts/parts_add'
import parts_get from '../../src/parts/parts_get'
import parts_remove from '../../src/parts/parts_remove'
import add_tool from '../../src/tools/add_tool'
import change_tool_status from '../../src/tools/change_tool_status'
import checkout_tool from '../../src/tools/checkout_tool'
import get_category from '../../src/tools/get_category'
import get_tool from '../../src/tools/get_tool'
import get_tools from '../../src/tools/get_tools'
import reserve_tool from '../../src/tools/reserve_tool'
import return_tool from '../../src/tools/return_tool'

module.exports = async (req: NowRequest, res: NowResponse) => {
	switch (req.body.endpoint) {
		case 'parts-get':
			parts_get(req, res)
			break
		case 'parts-add':
			parts_add(req, res)
			break
		case 'parts-remove':
			parts_remove(req, res)
			break
		case 'add-tool':
			add_tool(req, res)
			break
		case 'change-tool-status':
			change_tool_status(req, res)
			break
		case 'checkout-tool':
			checkout_tool(req, res)
			break
		case 'get-category':
			get_category(req, res)
			break
		case 'get-tool':
			get_tool(req, res)
			break
		case 'get-tools':
			get_tools(req, res)
			break
		case 'reserve-tool':
			reserve_tool(req, res)
			break
		case 'return-tool':
			return_tool(req, res)
			break
		default:
			res.status(400).json({ err: 'endpoint doesnt exist!!' })
	}
}
