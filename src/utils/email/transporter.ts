import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import VerificationEmail from "./VerificationEmail";
import ResetPassword from "./ResetPasswordEmail";

if (!process.env.GMAIL_SENDER_EMAIL || !process.env.GMAIL_SENDER_PASSWORD) {
  throw new Error("Gmail email or password missing.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SENDER_EMAIL,
    pass: process.env.GMAIL_SENDER_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  verificationLink: string
) {
  const emailHtml = await render(
    VerificationEmail({
      useremail: email,
      logo: process.env.URL + "/logo.png",
      verificationLink,
    })
  );

  const mailOptions = {
    from: process.env.GMAIL_SENDER_EMAIL as string,
    to: email,
    subject: "Fund Impact | Please verify you Email.",
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const emailHtml = await render(
    ResetPassword({
      useremail: email,
      logo: process.env.URL + "/logo.png",
      resetLink: `${process.env.URL}/auth/newPassword?token=${resetToken}`,
    })
  );

  const mailOptions = {
    from: process.env.GMAIL_SENDER_EMAIL as string,
    to: email,
    subject: "Fund Impact | Password reset request.",
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}
