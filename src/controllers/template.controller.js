const {
  createTemplateService,
  getTemplatesService,
  getTemplateByIdService,
  updateTemplateService,
  deleteTemplateService,
} = require("../services/template.service");

const { deleteTemplateImage, verifyImageSignature } = require("../middleware/templateUpload.middleware");

async function handleImageIfPresent(req, res) {
  if (!req.file) return { ok: true, imageUrl: undefined };

  const validImage = await verifyImageSignature(req.file.path);
  if (!validImage) {
    deleteTemplateImage(req.file.filename);
    res.status(400).json({
      success: false,
      message: "Uploaded file is not a valid image.",
    });
    return { ok: false };
  }

  return { ok: true, imageUrl: `/uploads/templates/${req.file.filename}` };
}

exports.createTemplate = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      if (req.file) deleteTemplateImage(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const imageResult = await handleImageIfPresent(req, res);
    if (!imageResult.ok) return;

    const template = await createTemplateService({
      title: title.trim(),
      description: description ? description.trim() : "",
      ...(imageResult.imageUrl && { imageUrl: imageResult.imageUrl }),
    });

    return res.status(201).json({
      success: true,
      message: "Template added successfully.",
      data: template,
    });
  } catch (error) {
    if (req.file) deleteTemplateImage(req.file.filename);
    console.error("Create Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const templates = await getTemplatesService();

    return res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("Get Templates Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    const template = await getTemplateByIdService(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Get Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (title !== undefined && !title.trim()) {
      if (req.file) deleteTemplateImage(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const imageResult = await handleImageIfPresent(req, res);
    if (!imageResult.ok) return;

    const template = await updateTemplateService(req.params.id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(imageResult.imageUrl && { imageUrl: imageResult.imageUrl }),
    });

    if (!template) {
      if (req.file) deleteTemplateImage(req.file.filename);
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template updated successfully.",
      data: template,
    });
  } catch (error) {
    if (req.file) deleteTemplateImage(req.file.filename);
    console.error("Update Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await deleteTemplateService(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};