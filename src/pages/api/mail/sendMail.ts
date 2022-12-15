import type {NextApiRequest, NextApiResponse} from 'next'
import mailer from '@sendgrid/mail';
import {MailDataRequired} from "@sendgrid/helpers/classes/mail";
import {EmailData} from "@sendgrid/helpers/classes/email-address";

if (!process.env.SENDGRID_API_KEY) {

}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: String;
    type: String
    content: String
    emails: Array<String>
  };
}

type Data = {
  ok: boolean;
  msg: string
}

export default async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<Data>
) {
  try {
    mailer.setApiKey(process.env.SENDGRID_API_KEY as string)
    const {email, content, type, emails} = req.body;

    // @ts-ignore
    const msg: MailDataRequired = {
      to: emails,
      from: 'berriosm.sg@gmail.com',
      subject: `Quieren tus servicios de ${type}!`,
      html: `<h4>${email} te quiere contactar. </h4> <p> Situación descrita: <br/> ${content}. </p>`,
    }
    await mailer.send(msg);
    return res.status(200).json({ok: true, msg: 'Correo enviado exitosamente'})
  } catch (e) {
    console.error(e)
    return res.status(400).json({ok: true, msg: 'Enviar Mensaje'})
  }
}