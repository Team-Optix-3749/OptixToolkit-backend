import express, { Request, Response } from 'express'
import parts_add from './parts/parts_add'
import parts_get from './parts/parts_get'
import parts_remove from './parts/parts_remove'
import add_tool from './tools/add_tool'
import remove_tool from './tools/remove_tool'
import change_tool_status from './tools/change_tool_status'
import checkout_tool from './tools/checkout_tool'
import get_category from './tools/get_category'
import get_tool from './tools/get_tool'
import get_tools from './tools/get_tools'
import reserve_tool from './tools/reserve_tool'
import remove_reservation from './tools/remove_reservation'
import return_tool from './tools/return_tool'
import remove_user from './users/remove_user'
import list_users from './users/list_users'
import create_user from './users/create_user'
import certify_user from './users/certify_user'
import reimbursement from './parts/reimbursement'
import parts_webhook from './parts/parts-webhook'
import check_in from './hours/check_in'
import check_out from './hours/check_out'
import get_seconds from './hours/get_seconds'
import { PORT, WEBHOOK_SECRET } from './utils/config'

const app = express()

app.use(express.json())

//potentially change to POST
app.all('/', (req: Request, res: Response) => {
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
		case 'remove-tool':
			remove_tool(req, res)
			break
		case 'remove-reservation':
			remove_reservation(req, res)
			break
		case 'remove-user':
			remove_user(req, res)
			break
		case 'list-users':
			list_users(req, res)
			break
		case 'create-user':
			create_user(req, res)
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
		case 'reimbursement':
			reimbursement(req, res)
			break
		case 'certify-user':
			certify_user(req, res)
			break
    case 'check-out':
      check_out(req, res)
      break
	 case 'get-seconds':
		get_seconds(req,res)
		break
    case 'check-in':
      check_in(req, res)
      break
		default:
			res.status(400).json({ err: 'endpoint doesnt exist!!' })
	}
})

app.get(`/${WEBHOOK_SECRET}`, parts_webhook)

app.listen(PORT, () => {
	console.log('Server Started!!')
})
