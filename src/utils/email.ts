import * as nodemailer from "nodemailer";

const { EMAIL_SENDER, EMAIL_PASSWORD, EMAIL_SMTP_SERVER, EMAIL_SMTP_PORT } =
  process.env;

const transporter = nodemailer.createTransport({
  host: EMAIL_SMTP_SERVER,
  port: EMAIL_SMTP_PORT,
  secure: false,
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
});

export async function sendEmailNotification(
  meetingDetails: string,
  toEmail: string
) {
  await transporter.sendMail({
    from: EMAIL_SENDER,
    to: toEmail,
    subject: "New Meeting Booked",
    text: `A new meeting has been booked: ${meetingDetails}`,
  });
  console.log("email sent..........");
}
