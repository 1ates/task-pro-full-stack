import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendPasswordEmail = async (options) => {
  return await transporter.sendMail(options);
};

export const sendHelpEmail = async ({ email, comment }) => {
  await transporter.sendMail({
    from: env(SMTP.SMTP_USER),
    to: env('MAIL_TO') || env('MAIL_USER'),
    replyTo: email,
    subject: 'TaskPro - Need help request',
    text: `From: ${email}\n\n${comment}`,
  });
};
