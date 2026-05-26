// services/article.service.js

const Article =
  require(
    "../models/article.model"
  );

/*
========================================
CREATE ARTICLE
========================================
*/

exports.createArticleService =
  async (
    req
  ) => {

    const {
      title,
      excerpt,
      category,
      author,
      readTime,
    } = req.body;

    const files =
      req.files;

    const coverImage =
      files?.coverImage?.[0];

    const pdf =
      files?.pdf?.[0];

    if (!pdf) {

      throw new Error(
        "PDF is required"
      );
    }

    const article =
      await Article.create(
        {
          title,

          excerpt,

          category,

          author,

          readTime,

          coverImage:
            coverImage
              ? `/uploads/article-covers/${coverImage.filename}`
              : "",

          pdfUrl:
            `/uploads/article-pdfs/${pdf.filename}`,

          createdBy:
            req.user.id,
        }
      );

    return article;
  };

/*
========================================
GET ALL ARTICLES
========================================
*/

exports.getAllArticlesService =
  async () => {

    const articles =
      await Article.find()
        .sort({
          createdAt: -1,
        });

    return articles;
  };

/*
========================================
GET SINGLE ARTICLE
========================================
*/

exports.getSingleArticleService =
  async (
    id
  ) => {

    const article =
      await Article.findById(
        id
      );

    if (!article) {

      throw new Error(
        "Article not found"
      );
    }

    return article;
  };

/*
========================================
UPDATE ARTICLE
========================================
*/

exports.updateArticleService =
  async (
    req
  ) => {

    const { id } =
      req.params;

    const article =
      await Article.findById(
        id
      );

    if (!article) {

      throw new Error(
        "Article not found"
      );
    }

    const files =
      req.files;

    const coverImage =
      files?.coverImage?.[0];

    const pdf =
      files?.pdf?.[0];

    article.title =
      req.body.title;

    article.excerpt =
      req.body.excerpt;

    article.category =
      req.body.category;

    article.author =
      req.body.author;

    article.readTime =
      req.body.readTime;

    if (
      coverImage
    ) {

      article.coverImage =
        `/uploads/article-covers/${coverImage.filename}`;
    }

    if (pdf) {

      article.pdfUrl =
        `/uploads/article-pdfs/${pdf.filename}`;
    }

    await article.save();

    return article;
  };

/*
========================================
DELETE ARTICLE
========================================
*/

exports.deleteArticleService =
  async (
    id
  ) => {

    const article =
      await Article.findById(
        id
      );

    if (!article) {

      throw new Error(
        "Article not found"
      );
    }

    await Article.findByIdAndDelete(
      id
    );

    return true;
  };