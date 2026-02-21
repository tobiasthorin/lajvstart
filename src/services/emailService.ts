import Nodemailer from "nodemailer"

type SendEmailParams = {
  body: string
  eventName: string
  recipients: string[]
  subject: string
}

export async function sendEmail({
  body,
  eventName,
  recipients,
  subject,
}: SendEmailParams) {
  const transporter = Nodemailer.createTransport({
    auth: {
      pass: import.meta.env.EMAIL_PASSWORD,
      user: import.meta.env.EMAIL_USER,
    },
    host: import.meta.env.EMAIL_HOST,
    port: Number(import.meta.env.EMAIL_PORT),
    secure: Number(import.meta.env.EMAIL_PORT) === 465,
  })

  const adresses = recipients.join(", ")

  const info = await transporter.sendMail({
    bcc: adresses,
    from: `"${eventName}" <noreply@lajvstart.se>`,
    subject,
    text: body,
    to: "noreply@lajvstart.se",
  })

  return info
}
