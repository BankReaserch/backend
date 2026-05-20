const express = require(
  "express"
);

const router =
  express.Router();

const {
  authenticate,
  isAdmin,
} = require(
  "../middleware/auth.middleware"
);

const {
  addQNAController,
  getQNAController,
  getSingleQNAController,
  updateQNAController,
  deleteQNAController,
} = require(
  "../controllers/qna.controller"
);

// ADD
router.post(
  "/add",
  authenticate,
  isAdmin,
  addQNAController
);

// GET ALL
router.get(
  "/",
  getQNAController
);

// GET SINGLE
router.get(
  "/:id",
  getSingleQNAController
);

// UPDATE
router.put(
  "/:id",
  authenticate,
  isAdmin,
  updateQNAController
);

// DELETE
router.delete(
  "/:id",
  authenticate,
  isAdmin,
  deleteQNAController
);

module.exports = router;