// controllers/article.controller.js

const {
  createArticleService,
  getAllArticlesService,
  getSingleArticleService,
  updateArticleService,
  deleteArticleService,
} = require(
  "../services/article.service"
);

/*
========================================
CREATE
========================================
*/

exports.createArticleController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const article =
        await createArticleService(
          req
        );

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Article created successfully",

          data: article,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
GET ALL
========================================
*/

exports.getAllArticlesController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const articles =
        await getAllArticlesService();

      return res
        .status(200)
        .json({
          success: true,

          data: articles,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
GET SINGLE
========================================
*/

exports.getSingleArticleController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const article =
        await getSingleArticleService(
          req.params.id
        );

      return res
        .status(200)
        .json({
          success: true,

          data: article,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
UPDATE
========================================
*/

exports.updateArticleController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const article =
        await updateArticleService(
          req
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Article updated successfully",

          data: article,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
DELETE
========================================
*/

exports.deleteArticleController =
  async (
    req,
    res,
    next
  ) => {

    try {

      await deleteArticleService(
        req.params.id
      );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Article deleted successfully",
        });

    } catch (error) {

      next(error);

    }
  };