const {
  createBusinessService,
  getBusinessesService,
  getBusinessByIdService,
  updateBusinessService,
  deleteBusinessService,
} = require("../services/business.service");

const { deleteLogoFile, verifyImageSignature } = require("../middleware/businessUpload.middleware");
function isSafeWebsite(website) {
  if (!website) return true;
  return !/^(javascript|data|vbscript|file):/i.test(website.trim());
}

async function handleLogoIfPresent(req, res) {
  if (!req.file) return { ok: true, logoUrl: undefined };

  const validImage = await verifyImageSignature(req.file.path);
  if (!validImage) {
    deleteLogoFile(req.file.filename);
    res.status(400).json({
      success: false,
      message: "Uploaded file is not a valid image.",
    });
    return { ok: false };
  }

  return { ok: true, logoUrl: `/uploads/businesses/${req.file.filename}` };
}

exports.createBusiness = async (req, res) => {
  try {
    const { name, website, date, notes } = req.body;

    if (!name || !name.trim()) {
      if (req.file) deleteLogoFile(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Business name is required.",
      });
    }

    if (!isSafeWebsite(website)) {
      if (req.file) deleteLogoFile(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Invalid website URL.",
      });
    }

    const logoResult = await handleLogoIfPresent(req, res);
    if (!logoResult.ok) return; // response already sent

    const business = await createBusinessService({
      name: name.trim(),
      website: website ? website.trim() : "",
      date: date || null,
      notes: notes ? notes.trim() : "",
      ...(logoResult.logoUrl && { logoUrl: logoResult.logoUrl }),
    });

    return res.status(201).json({
      success: true,
      message: "Business added successfully.",
      data: business,
    });
  } catch (error) {
    if (req.file) deleteLogoFile(req.file.filename);
    console.error("Create Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await getBusinessesService();

    return res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    console.error("Get Businesses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.getBusiness = async (req, res) => {
  try {
    const business = await getBusinessByIdService(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Get Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const { name, website, date, notes } = req.body;

    if (name !== undefined && !name.trim()) {
      if (req.file) deleteLogoFile(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Business name is required.",
      });
    }

    if (!isSafeWebsite(website)) {
      if (req.file) deleteLogoFile(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Invalid website URL.",
      });
    }

    const logoResult = await handleLogoIfPresent(req, res);
    if (!logoResult.ok) return; // response already sent

    // Only known fields are ever written — never spread raw req.body into
    // the update, so an unexpected field in the payload can't silently
    // change something it shouldn't (mass-assignment protection).
    const business = await updateBusinessService(req.params.id, {
      ...(name !== undefined && { name: name.trim() }),
      ...(website !== undefined && { website: website.trim() }),
      ...(date !== undefined && { date: date || null }),
      ...(notes !== undefined && { notes: notes.trim() }),
      ...(logoResult.logoUrl && { logoUrl: logoResult.logoUrl }),
    });

    if (!business) {
      if (req.file) deleteLogoFile(req.file.filename);
      return res.status(404).json({
        success: false,
        message: "Business not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business updated successfully.",
      data: business,
    });
  } catch (error) {
    if (req.file) deleteLogoFile(req.file.filename);
    console.error("Update Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const business = await deleteBusinessService(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};