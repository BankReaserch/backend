const nodemailer = require("nodemailer");

const sendEmail = async (to, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // for dev only
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use App Password (NOT your real password)
      },
    });

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Email Verification</h2>
          <p>Click the button below to verify your account:</p>
          
          <a href="${verificationLink}" 
             style="
               display:inline-block;
               padding:10px 20px;
               background:#4CAF50;
               color:white;
               text-decoration:none;
               border-radius:5px;
             ">
             Verify Email
          </a>

          <p style="margin-top:20px;">
            Or copy and paste this link in your browser:
          </p>
          <p>${verificationLink}</p>

          <p style="color: gray; font-size: 12px;">
            This link will expire in 15 minutes.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;