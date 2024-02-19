const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      required: true,
    },
    parentId: {
      type: mongoose.Types.ObjectId,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

modelSchema.pre("save", async function (next) {
  const labels = this;
  labels.seqId = await counterIncrementor("domain");
  next();
});

/**
 * @typedef domain
 */
const Labels = mongoose.model("domain", modelSchema);

module.exports = Labels;

