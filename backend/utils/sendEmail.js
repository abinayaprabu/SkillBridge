import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {

  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SkillBridge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");

  } catch (error) {

    console.error("Email Error:", error.message);

  }

};