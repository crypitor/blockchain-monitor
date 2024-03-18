import * as nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const SMTP_CONFIG = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(SMTP_CONFIG);
  return await transporter.sendMail({
    from: process.env.SMTP_SERNDER,
    to,
    subject,
    html,
  });
};
