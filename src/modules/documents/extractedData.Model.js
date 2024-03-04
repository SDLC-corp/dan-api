const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
  {
    documentId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    seqId: {
      type: Number
    },
    extractedData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

modelSchema.pre("save", async function (next) {
  const doc = this;
  doc.seqId = await counterIncrementor("extracted_data");
  next();
});

/**
 * @typedef ExtractedData
 */
const ExtractedData = mongoose.model("extracted_data", modelSchema);

module.exports = ExtractedData;
