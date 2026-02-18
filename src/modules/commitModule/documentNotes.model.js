const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
  {
    documentId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
    },    
    notes: {
        type: String,
        required:true
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
  const documents = this;
  documents.seqId = await counterIncrementor("documentnotes");
  next();
});

/**
 * @typedef Labels
 */
const documents = mongoose.model("documentnotes", modelSchema);

module.exports = documents;
