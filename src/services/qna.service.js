const QNA =
  require(
    "../models/qna.model"
  );

exports.addQNAService =
  async (req) => {

    const {
      category,
      categoryPriority,
      priority,
      question,
      answer,
      isPublished,
    } = req.body;

    if (!category?.trim()) {

      throw new Error(
        "Category required"
      );

    }

    if (!question?.trim()) {

      throw new Error(
        "Question required"
      );

    }

    if (!answer?.trim()) {

      throw new Error(
        "Answer required"
      );

    }

    const categoryName =
      category.trim();

    const categoryPriorityNumber =
      Number(
        categoryPriority
      );

    const questionPriority =
      Number(priority);

    const existingCategory =
      await QNA.findOne({
        category:
          categoryName,
      });

    if (
      existingCategory &&
      existingCategory.categoryPriority !==
        categoryPriorityNumber
    ) {

      throw new Error(
        `Category "${categoryName}" already uses priority ${existingCategory.categoryPriority}`
      );

    }

    const priorityUsed =
      await QNA.findOne({
        category: {
          $ne:
            categoryName,
        },

        categoryPriority:
          categoryPriorityNumber,
      });

    if (
      priorityUsed
    ) {

      throw new Error(
        `Category priority ${categoryPriorityNumber} already belongs to "${priorityUsed.category}"`
      );

    }

    const duplicatePriority =
      await QNA.findOne({
        category:
          categoryName,

        priority:
          questionPriority,
      });

    if (
      duplicatePriority
    ) {

      throw new Error(
        "Question priority already exists in this category"
      );

    }

    const duplicateQuestion =
      await QNA.findOne({
        category:
          categoryName,

        question:
          question.trim(),
      });

    if (
      duplicateQuestion
    ) {

      throw new Error(
        "Question already exists in this category"
      );

    }

    return await QNA.create({
      category:
        categoryName,

      categoryPriority:
        categoryPriorityNumber,

      priority:
        questionPriority,

      question:
        question.trim(),

      answer:
        answer.trim(),

      isPublished:
        isPublished !==
          false &&
        isPublished !==
          "false",
    });

  };

exports.getQNAService =
  async (req) => {

    const {
      search,
      category,
      published,
    } = req.query;

    const filter = {};

    if (search) {

      filter.$text = {
        $search: search,
      };

    }

    if (
      category &&
      category !== "all"
    ) {

      filter.category =
        category;

    }

    if (
      published !==
      undefined
    ) {

      filter.isPublished =
        published ===
        "true";

    }

    return await QNA.find(
      filter
    ).sort({
      categoryPriority: 1,
      priority: 1,
    });

  };

exports.getSingleQNAService =
  async (req) => {

    const { id } =
      req.params;

    const qna =
      await QNA.findById(
        id
      );

    if (!qna) {

      throw new Error(
        "Q&A not found"
      );

    }

    return qna;

  };

exports.updateQNAService =
  async (req) => {

    const { id } =
      req.params;

    const existing =
      await QNA.findById(
        id
      );

    if (!existing) {

      throw new Error(
        "Q&A not found"
      );

    }

    const categoryName =
      (
        req.body.category ||
        existing.category
      ).trim();

    const categoryPriorityNumber =
      Number(
        req.body
          .categoryPriority ??
          existing.categoryPriority
      );

    const questionPriority =
      Number(
        req.body.priority ??
          existing.priority
      );

    const question =
      (
        req.body.question ||
        existing.question
      ).trim();

    const answer =
      (
        req.body.answer ||
        existing.answer
      ).trim();

    const sameCategory =
      await QNA.findOne({
        category:
          categoryName,

        _id: {
          $ne: id,
        },
      });

    if (
      sameCategory &&
      sameCategory.categoryPriority !==
        categoryPriorityNumber
    ) {

      throw new Error(
        `Category "${categoryName}" already uses priority ${sameCategory.categoryPriority}`
      );

    }

    const priorityUsed =
      await QNA.findOne({
        category: {
          $ne:
            categoryName,
        },

        categoryPriority:
          categoryPriorityNumber,

        _id: {
          $ne: id,
        },
      });

    if (
      priorityUsed
    ) {

      throw new Error(
        `Category priority ${categoryPriorityNumber} already belongs to "${priorityUsed.category}"`
      );

    }

    const duplicatePriority =
      await QNA.findOne({
        category:
          categoryName,

        priority:
          questionPriority,

        _id: {
          $ne: id,
        },
      });

    if (
      duplicatePriority
    ) {

      throw new Error(
        "Question priority already exists in this category"
      );

    }

    const duplicateQuestion =
      await QNA.findOne({
        category:
          categoryName,

        question,

        _id: {
          $ne: id,
        },
      });

    if (
      duplicateQuestion
    ) {

      throw new Error(
        "Question already exists in this category"
      );

    }

    existing.category =
      categoryName;

    existing.categoryPriority =
      categoryPriorityNumber;

    existing.priority =
      questionPriority;

    existing.question =
      question;

    existing.answer =
      answer;

    if (
      req.body
        .isPublished !==
      undefined
    ) {

      existing.isPublished =
        req.body
          .isPublished ===
          true ||
        req.body
          .isPublished ===
          "true";

    }

    await existing.save();

    return existing;

  };

exports.deleteQNAService =
  async (req) => {

    const { id } =
      req.params;

    const existing =
      await QNA.findById(
        id
      );

    if (!existing) {

      throw new Error(
        "Q&A not found"
      );

    }

    await QNA.findByIdAndDelete(
      id
    );

    return true;

  };