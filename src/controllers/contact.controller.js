const {
  sendContactEmail,
} = require(
  "../services/contact.service"
);

exports.contactController =
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        subject,
        message,
      } = req.body;

      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {

        return res.status(400)
          .json({
            success: false,
            message:
              "All required fields are missing",
          });
      }

      await sendContactEmail({
        name,
        email,
        phone,
        subject,
        message,
      });

      return res.json({
        success: true,
        message:
          "Inquiry sent successfully",
      });

    } catch (error) {

      console.error(error);

      return res.status(500)
        .json({
          success: false,
          message:
            "Failed to send inquiry",
        });
    }
  };