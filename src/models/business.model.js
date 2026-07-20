const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: [120, "Business name must be under 120 characters"],
    },
    logoUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Logo URL is too long"],
    },
    website: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Website URL is too long"],
      validate: {
        validator: (value) => !value || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(value),
        message: "Website must be a valid URL",
      },
    },
    date: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2000, "Notes must be under 2000 characters"],
    },
  },
  { timestamps: true }
);

businessSchema.index({ name: "text", notes: "text" });

module.exports = mongoose.model("Business", businessSchema);