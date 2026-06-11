const QNA = require("../models/qna.model");

exports.addQNAService = async (req) => {
  const {
    category,
    priority,
    question,
    answer,
    isPublished,
  } = req.body;

  if (!category) {
    throw new Error("Category required");
  }

  if (!question) {
    throw new Error("Question required");
  }

  if (!answer) {
    throw new Error("Answer required");
  }

  const priorityNumber =
    Number(priority) || 1;

  const existing =
    await QNA.findOne({
      category,
      priority: priorityNumber,
    });

  if (existing) {
    throw new Error(
      "Priority already exists in this category"
    );
  }

  const newQNA =
    await QNA.create({
      category,
      priority: priorityNumber,
      question,
      answer,
      isPublished:
        isPublished !== false &&
        isPublished !== "false",
    });

  return await QNA.findById(
    newQNA._id
  ).populate(
    "category",
    "name priority"
  );
};

exports.getQNAService = async (req) => {
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
    published !== undefined
  ) {
    filter.isPublished =
      published === "true";
  }

  const qna =
    await QNA.find(filter)
      .populate(
        "category",
        "name priority"
      );

  qna.sort((a, b) => {
    const categorySort =
      a.category.priority -
      b.category.priority;

    if (
      categorySort !== 0
    ) {
      return categorySort;
    }

    return (
      a.priority -
      b.priority
    );
  });

  return qna;
};

exports.getSingleQNAService =
  async (req) => {

    const { id } =
      req.params;

    const qna =
      await QNA.findById(id)
        .populate(
          "category",
          "name priority"
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
      await QNA.findById(id);

    if (!existing) {
      throw new Error(
        "Q&A not found"
      );
    }

    const category =
      req.body.category ||
      existing.category;

    const priority =
      Number(
        req.body.priority
      ) ||
      existing.priority;

    const duplicate =
      await QNA.findOne({
        category,
        priority,
        _id: {
          $ne: id,
        },
      });

    if (duplicate) {
      throw new Error(
        "Priority already exists in this category"
      );
    }

    existing.category =
      category;

    existing.priority =
      priority;

    existing.question =
      req.body.question ??
      existing.question;

    existing.answer =
      req.body.answer ??
      existing.answer;

    if (
      req.body.isPublished !==
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

    return await QNA.findById(
      existing._id
    ).populate(
      "category",
      "name priority"
    );
  };

exports.deleteQNAService =
  async (req) => {

    const { id } =
      req.params;

    const existing =
      await QNA.findById(id);

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