// services/user.service.js

const mongoose =
  require("mongoose");

const User =
  require("../models/user.model");

/*
========================================
GET ALL USERS
========================================
*/

exports.getAllUsersService =
  async () => {

    const users =
      await User.find({
        role: "user",
      })
        .select(
          "name email role isActive createdAt"
        )
        .sort({
          createdAt: -1,
        });

    return users;
  };

/*
========================================
TOGGLE USER STATUS
========================================
*/

exports.toggleUserStatusService =
  async (
    userId,
    isActive
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {

      throw new Error(
        "Invalid user ID"
      );
    }

    const user =
      await User.findById(
        userId
      );

    if (!user) {

      throw new Error(
        "User not found"
      );
    }

    // ❌ Prevent admin disable
    if (
      user.role ===
      "admin"
    ) {

      throw new Error(
        "Admin cannot be modified"
      );
    }

    user.isActive =
      isActive;

    await user.save();

    return user;
  };