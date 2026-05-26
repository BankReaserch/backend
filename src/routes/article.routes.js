// routes/article.routes.js

const express =
  require("express");

const router =
  express.Router();

const {
  authenticate,
  isAdmin,
} = require(
  "../middleware/auth.middleware"
);

const upload =
  require(
    "../middleware/articleUpload.middleware"
  );

const articleController =
  require(
    "../controllers/article.controller"
  );

/*
========================================
PUBLIC
========================================
*/

router.get(
  "/all",
  articleController.getAllArticlesController
);

router.get(
  "/:id",
  articleController.getSingleArticleController
);

/*
========================================
ADMIN
========================================
*/

router.post(
  "/create",

  authenticate,

  isAdmin,

  upload.fields([
    {
      name:
        "coverImage",

      maxCount: 1,
    },

    {
      name: "pdf",

      maxCount: 1,
    },
  ]),

  articleController.createArticleController
);

router.put(
  "/update/:id",

  authenticate,

  isAdmin,

  upload.fields([
    {
      name:
        "coverImage",

      maxCount: 1,
    },

    {
      name: "pdf",

      maxCount: 1,
    },
  ]),

  articleController.updateArticleController
);

router.delete(
  "/delete/:id",

  authenticate,

  isAdmin,

  articleController.deleteArticleController
);

module.exports =
  router;