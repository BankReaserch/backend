const AppError = require("./AppError");

const GENERIC_MESSAGE =
  "Something went wrong. Please try again later.";

exports.sendErrorResponse = (
  res,
  error,
  context = "unknown"
) => {

  console.error(
    `[${context}]`,
    error
  );

  if (
    error instanceof AppError &&
    error.isOperational
  ) {
    return res
      .status(error.statusCode)
      .json({
        success: false,
        message: error.message,
      });
  }

  if (error?.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID provided",
    });
  }

  if (error?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        "A record with this value already exists",
    });
  }

  return res.status(500).json({
    success: false,
    message: GENERIC_MESSAGE,
  });
};