const register = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const result = await register.check();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error); // pass to global error handler
  }
};