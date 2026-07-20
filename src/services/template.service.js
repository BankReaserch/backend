const Template = require("../models/template.model");
const { deleteTemplateImage } = require("../middleware/templateUpload.middleware");

exports.createTemplateService = async (data) => {
  return await Template.create(data);
};

exports.getTemplatesService = async () => {
  return await Template.find().sort({ createdAt: -1 });
};

exports.getTemplateByIdService = async (id) => {
  return await Template.findById(id);
};

exports.updateTemplateService = async (id, data) => {
  const existing = await Template.findById(id);
  if (!existing) return null;

  if (data.imageUrl && existing.imageUrl && data.imageUrl !== existing.imageUrl) {
    deleteTemplateImage(existing.imageUrl);
  }

  return await Template.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteTemplateService = async (id) => {
  const template = await Template.findByIdAndDelete(id);
  if (template) deleteTemplateImage(template.imageUrl);
  return template;
};