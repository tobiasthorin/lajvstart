import Nodemailer from "nodemailer"

type SendEmailParams = {
  subject: string
  recipients: string[]
  body: string
  eventName: string
}

export async function sendEmail({
  subject,
  recipients,
  body,
  eventName,
}: SendEmailParams) {
  const transporter = Nodemailer.createTransport({
    host: import.meta.env.EMAIL_HOST,
    port: Number(import.meta.env.EMAIL_PORT),
    secure: Number(import.meta.env.EMAIL_PORT) === 465,
    auth: {
      user: import.meta.env.EMAIL_USER,
      pass: import.meta.env.EMAIL_PASSWORD,
    },
  })

  const adresses = recipients.join(", ")

  const info = await transporter.sendMail({
    from: `"${eventName}" <noreply@lajvstart.se>`,
    to: "noreply@lajvstart.se",
    bcc: adresses,
    subject,
    text: body,
  })

  return info
}
