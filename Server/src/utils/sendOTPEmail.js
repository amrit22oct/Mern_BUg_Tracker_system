import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h3>Your OTP Code</h3>
        <p>Your OTP code is: <b>${otp}</b></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.response || error.message || error);
    throw new Error("Failed to send OTP email");
  }
};
