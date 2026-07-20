const Business = require("../models/business.model");
const { deleteLogoFile } = require("../middleware/businessUpload.middleware");

exports.createBusinessService = async (data) => {
  return await Business.create(data);
};

exports.getBusinessesService = async () => {
  return await Business.find().sort({ createdAt: -1 });
};

exports.getBusinessByIdService = async (id) => {
  return await Business.findById(id);
};

exports.updateBusinessService = async (id, data) => {
  const existing = await Business.findById(id);
  if (!existing) return null;
  if (data.logoUrl && existing.logoUrl && data.logoUrl !== existing.logoUrl) {
    deleteLogoFile(existing.logoUrl);
  }

  return await Business.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteBusinessService = async (id) => {
  const business = await Business.findByIdAndDelete(id);
  if (business) deleteLogoFile(business.logoUrl);
  return business;
};