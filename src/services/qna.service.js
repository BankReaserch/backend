const QNA = require(
  "../models/qna.model"
);

// ADD
exports.addQNAService =
  async (req) => {

    const {
      category,
      priority,
      question,
      answer,
      isPublished,
    } = req.body;

    if (!category) {
      throw new Error(
        "Category required"
      );
    }

    if (!question) {
      throw new Error(
        "Question required"
      );
    }

    if (!answer) {
      throw new Error(
        "Answer required"
      );
    }

    const newQNA =
      await QNA.create({
        category,

        priority:
          Number(
            priority
          ) || 1,

        question,

        answer,

        isPublished:
          isPublished !==
          "false",
      });

    return newQNA;
  };

// GET ALL
exports.getQNAService =
  async (req) => {

    const {
      search,
      category,
    } = req.query;

    let filter = {};

    // SEARCH
    if (search) {

      filter.$text = {
        $search: search,
      };
    }

    // CATEGORY
    if (
      category &&
      category !== "all"
    ) {

      filter.category =
        category;
    }

    const qna =
      await QNA.find(filter)
        .sort({
          priority: 1,
          createdAt: -1,
        });

    return qna;
  };

// GET SINGLE
exports.getSingleQNAService =
  async (req) => {

    const { id } =
      req.params;

    const qna =
      await QNA.findById(id);

    if (!qna) {

      throw new Error(
        "Q&A not found"
      );
    }

    return qna;
  };

// UPDATE
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

    const updated =
      await QNA.findByIdAndUpdate(
        id,
        {
          ...req.body,

          priority:
            Number(
              req.body
                .priority
            ) || 1,
        },
        {
          new: true,
        }
      );

    return updated;
  };

// DELETE
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