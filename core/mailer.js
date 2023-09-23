import nodemailer from "nodemailer";

export const options = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
  port: Number(process.env.MAILTRAP_PORT) || 2525,
  auth: {
    user: process.env.MAILTRAP_USER || "bfdd92659fbe01",
    pass: process.env.MAILTRAP_PASS || "bc3cf16367ea14",
  },
});
