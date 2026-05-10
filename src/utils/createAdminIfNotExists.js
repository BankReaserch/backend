const User = require("../models/user.model");

const generatePassword = () => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+{}[]<>?";

  const all = upper + lower + numbers + special;

  const getRandom = (str) =>
    str[Math.floor(Math.random() * str.length)];

  // Ensure all required types exist
  let password =
    getRandom(upper) +
    getRandom(lower) +
    getRandom(numbers) +
    getRandom(special);

  // Fill remaining length (12+ recommended)
  for (let i = 4; i < 12; i++) {
    password += getRandom(all);
  }

  // Shuffle password (important)
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const createAdminIfNotExists = async () => {
  try {
    const adminEmail = "samiramrullah@gmail.com";
    const existingAdmin = await User.findOne({
      role: "admin",
    });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }

    const password = generatePassword();

    const admin = await User.create({
      email: adminEmail,
      password,
      role: "admin",
      isVerified: true,
      mustChangePassword: true, 
    });

    console.log("🔥 ADMIN CREATED 🔥");
    console.log("Email:", adminEmail);
    console.log("Password:", password);
    console.log("⚠️ Please change password after login");

  } catch (error) {
    console.error("❌ Admin creation failed:", error.message);
  }
};

module.exports = createAdminIfNotExists;