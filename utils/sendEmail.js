import transporter from "./nodemailer.js";
import { OtpTemplate } from "../utils/emailTemplates.js";
export const sendEmail = async ({ to, from, subject, otp, username }) => {
  await transporter.sendMail({
    from,
    to,
    subject,
    html: OtpTemplate({ otp, username }),
  });
};
