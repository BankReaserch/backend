const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendSubscriptionEmail = async (
  to,
  verificationLink
) => {
  try {
    await resend.emails.send({
      from: "Ribis <hello@samiramrullah.com>",
      to,

      subject: "Confirm Your Subscription",

      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">

          <h2>
            Subscribe to Ribis.org
          </h2>

          <p>
            Click below to confirm your subscription
            and receive updates from Ribis.org.
          </p>

          <a
            href="${verificationLink}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#C8A75B;
              color:white;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Confirm Subscription
          </a>

          <p style="margin-top:20px">
            ${verificationLink}
          </p>

        </div>
      `,
    });

  } catch (error) {

    console.error(
      "Subscription email failed",
      error
    );

    throw new Error(
      "Failed to send subscription email"
    );
  }
};

module.exports = sendSubscriptionEmail;