const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

exports.sendContactEmail =
  async ({
    name,
    email,
    phone,
    subject,
    message,
  }) => {

    await resend.emails.send({
      from:
        "Ribis <hello@samiramrullah.com>",

      to: [
       "samiramrullah@gmail.com",
      ],

      subject:
        `Contact Form: ${subject}`,

      html: `
        <div style="font-family:Arial,sans-serif">

          <h2>New Contact Inquiry</h2>

          <hr />

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone}
          </p>

          <p>
            <strong>Subject:</strong>
            ${subject}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div
            style="
              background:#f8f8f8;
              padding:16px;
              border-radius:8px;
            "
          >
            ${message}
          </div>

        </div>
      `,
    });

    /*
    ===========================
    AUTO REPLY TO USER
    ===========================
    */

    await resend.emails.send({
      from:
        "Ribis <hello@samiramrullah.com>",

      to: [email],

      subject:
        "We Received Your Inquiry",

      html: `
        <div style="font-family:Arial,sans-serif">

          <h2>Thank You</h2>

          <p>
            We have received your inquiry
            and will respond as soon as possible.
          </p>

          <p>
            Subject:
            <strong>${subject}</strong>
          </p>

          <p>
            Thank you for contacting Ribis.
          </p>

        </div>
      `,
    });
  };