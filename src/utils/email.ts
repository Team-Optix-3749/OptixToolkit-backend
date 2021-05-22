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
      email: 'dnhsteam3749@gmail.com'
    },
    subject: 'Automatic Reimbursement Form',
    html: `part name: ${info.partName}, part link: ${info.partLink}, reciept: ${info.pictureLink}, person: ${info.personName}, address: ${info.mailingAddress}`,
  }

  try {
    await sg.send(msg)
  }
  catch (e) {
    console.log(e.response.body.errors)
  }
}