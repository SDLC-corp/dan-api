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
    locationName: {
      type: String,
      default: ""
    },
    locationId: {
      type: String,
      default: ""
    },
    code: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      required:true,
      enum: ["ocean", "air"],
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
 * @typedef ShippingLines
 */
const Model = mongoose.model("shippingLines", modelSchema);

module.exports = Model;
