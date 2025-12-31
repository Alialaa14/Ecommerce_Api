import nodemailer from "nodemailer";
import { ENV } from "../utils/ENV.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "alifouda1474@gmail.com",
    pass: ENV.PASSWORD,
  },
});

export default transporter;
