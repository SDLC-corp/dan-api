const mongoose = require("mongoose");

const modelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required:true
    },
    modelId: {
      type: String,
      trim: true,
      required: true
    },
    logo: {
      type: String,
      trim: true,
      default: "/shippingline.png"
    },
    description: {
      type: String,
      default: ""
    },
    code: {
      type: String,
      default: ""
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef DocumentTypes
 */
const Model = mongoose.model("documentTypes", modelSchema);

module.exports = Model;
