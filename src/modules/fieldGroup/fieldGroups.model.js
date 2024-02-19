const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    index: {
      type: Number,
    },
    layout: {
      type: String,
      enum:["horizontal","vertical","table"]
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

modelSchema.pre("save", async function (next) {
  const fieldGroup = this;
  fieldGroup.index = await counterIncrementor("fieldGroup");
  next();
});

/**
 * @typedef Fields
 */
const Model = mongoose.model("fieldGroup", modelSchema);

module.exports = Model;
