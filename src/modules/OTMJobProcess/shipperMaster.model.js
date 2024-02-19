const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    current_index: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * @typedef shipper_master
 */
const Model = mongoose.model("shipper_master", modelSchema);

module.exports = Model;
