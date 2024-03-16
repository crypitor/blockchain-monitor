import * as nodemailer from 'nodemailer';

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);
const sender = process.env.SMTP_SERNDER;

export const sendEmail = async (to: string, subject: string, html: string) => {
  return await transporter.sendMail({
    from: sender,
    to,
    subject,
    html,
  });
};
