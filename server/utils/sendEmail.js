// utils/sendEmail.js
import transporter from "../config/email.js";

export default async function sendEmail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    ...(html && { html }),
  });
  console.log("Mail sent:", info.messageId);
  return info;
}
