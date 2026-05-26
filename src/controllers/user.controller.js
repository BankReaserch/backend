// controllers/user.controller.js

const {
  getAllUsersService,
  toggleUserStatusService,
} = require(
  "../services/user.service"
);

/*
========================================
GET ALL USERS
========================================
*/

exports.getAllUsersController =
  async (
    req,
    res
  ) => {

    try {

      const users =
        await getAllUsersService();

      return res
        .status(200)
        .json({
          success: true,

          data: users,
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };

/*
========================================
TOGGLE USER STATUS
========================================
*/

exports.toggleUserStatusController =
  async (
    req,
    res
  ) => {

    try {

      const user =
        await toggleUserStatusService(
          req.params.id,
          req.body
            .isActive
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            user.isActive
              ? "User activated"
              : "User deactivated",

          data: user,
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };