const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, verificationLink) => {
  try {
    const response = await resend.emails.send({
      from: "Ribis <hello@samiramrullah.com>",
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
    });

    console.log("✅ Email sent:", response);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;