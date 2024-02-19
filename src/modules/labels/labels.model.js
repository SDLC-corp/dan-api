const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      required: true,
    },
    shippingLineId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    fieldId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    logicCodeId: {
      type: mongoose.Types.ObjectId,
    },
    isOverride: {
      type: Boolean
    },
    overrideCustomLogic: {
      type: String
    },
    oclCreatedBy: {
      type: mongoose.Types.ObjectId,
    },
    oclUpdatedBy: {
      type: mongoose.Types.ObjectId,
    },
    oclCreatedAt:{
      type:Date
    },
    oclUpdatedAt:{
      type:Date
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
  const labels = this;
  labels.seqId = await counterIncrementor("labels");
  next();
});

/**
 * @typedef Labels
 */
const Labels = mongoose.model("labels", modelSchema);

module.exports = Labels;
