const {
  addQNAService,
  getQNAService,
  getSingleQNAService,
  updateQNAService,
  deleteQNAService,
} = require(
  "../services/qna.service"
);

// ADD
exports.addQNAController =
  async (req, res) => {

    try {

      const result =
        await addQNAService(
          req
        );

      return res.status(201).json({
        success: true,

        message:
          "Q&A created successfully",

        data: result,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

// GET ALL
exports.getQNAController =
  async (req, res) => {

    try {

      const result =
        await getQNAService(
          req
        );

      return res.status(200).json({
        success: true,

        data: result,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

// GET SINGLE
exports.getSingleQNAController =
  async (req, res) => {

    try {

      const result =
        await getSingleQNAService(
          req
        );

      return res.status(200).json({
        success: true,

        data: result,
      });

    } catch (error) {

      return res.status(404).json({
        success: false,

        message:
          error.message,
      });
    }
  };

// UPDATE
exports.updateQNAController =
  async (req, res) => {

    try {

      const result =
        await updateQNAService(
          req
        );

      return res.status(200).json({
        success: true,

        message:
          "Q&A updated successfully",

        data: result,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

// DELETE
exports.deleteQNAController =
  async (req, res) => {

    try {

      await deleteQNAService(
        req
      );

      return res.status(200).json({
        success: true,

        message:
          "Q&A deleted successfully",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };