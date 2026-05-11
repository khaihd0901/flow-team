import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// Create a transporter
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASSWORD,

    user: 'khaihd0901@gmail.com',
    pass: 'agsu lrej bmvt wyzi',
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: 'khaihd0901@gmail.com',
    to,
    subject,
    html,
  });
};