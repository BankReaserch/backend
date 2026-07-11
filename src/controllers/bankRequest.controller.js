const {
  createBankRequestService,
  getBankRequestsService,
  updateBankRequestService,
  deleteBankRequestService,
} = require("../services/bankRequest.service");

exports.createBankRequest = async (req, res) => {
  try {
    const {
      bankName,
      location,
      email,
      additionalContext,
    } = req.body;

    if (!bankName || !location || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const result = await createBankRequestService({
      bankName,
      location,
      email,
      additionalContext,
    });

    return res.status(201).json({
      success: true,
      message:
        "Your request has been submitted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Create Bank Request Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again later.",
    });
  }
};

exports.getBankRequests = async (req, res) => {
  try {
    const requests =
      await getBankRequestsService();

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Get Bank Requests Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again later.",
    });
  }
};

exports.updateBankRequest = async (req, res) => {
  try {
    const request =
      await updateBankRequestService(
        req.params.id,
        req.body
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request updated successfully.",
      data: request,
    });
  } catch (error) {
    console.error("Update Bank Request Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again later.",
    });
  }
};

exports.deleteBankRequest = async (req, res) => {
  try {
    const request =
      await deleteBankRequestService(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Bank Request Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again later.",
    });
  }
};