const userSchema = require('../models/user.model')
exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("All Fileds Are Required")
    error.status = 400
    throw error;
  }
  const existingUser = await userSchema.findOne({ email });
  if (existingUser) {
    const error = new Error("User Already Exists")
    error.status = 409;
    return error;
  }
  const user = await userSchema.create({
    email,
    password,
  })
  return user;
};