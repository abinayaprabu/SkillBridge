import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {

    const data = await resend.emails.send({
      from: "SkillBridge <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: `<p>${text.replace(/\n/g, "<br>")}</p>`
    });

    console.log("Email sent:", data);

  } catch (error) {
    console.error("Email Error FULL:", error);
  }
};