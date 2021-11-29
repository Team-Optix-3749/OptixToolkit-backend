//import sg from '@sendgrid/mail'
const sg = require('@sendgrid/mail')
import { SENDGRID_KEY } from './config'

sg.setApiKey(SENDGRID_KEY)

export interface ReimbursementBody {
  personName: string;
  partName: string;
  partLink: string;
  mailingAddress: string;
  pictureLink: string;
}

export async function sendEmail (info: ReimbursementBody) {
  const msg = {
    to: 'dnhsteam3749@gmail.com', 
    from: {
      name: 'Automatic Reimbursements',
      email: 'team3749devs@gmail.com'
    },
    subject: 'Automatic Reimbursement Form',
    html: `Part Name: ${info.partName}, Part Link: ${info.partLink}, Reciept: ${info.pictureLink}, Team Member: ${info.personName}, Address: ${info.mailingAddress}`,
  }

  try {
    await sg.send(msg)
  }
  catch (e) {
    console.log(e.response.body.errors)
  }
}
