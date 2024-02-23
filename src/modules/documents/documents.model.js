const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");
const { number, any, object, string } = require("joi");

const modelSchema = mongoose.Schema(
  {
    documentTypeId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
    },
    assignTo: {
      type: mongoose.Types.ObjectId,
    },
    orgId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    seqId: {
      type: Number
    },
    extractedData: {
      type: Object,
      default: {},
    },
    fieldsAndValues: {
      type: Array,
      default: [],
    },
    isJobDone: {
      type: Boolean,
      default: false,
    },
    isSuccess: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

modelSchema.pre("save", async function (next) {
  const documents = this;
  documents.seqId = await counterIncrementor("documents");
  next();
});

/**
 * @typedef Labels
 */
const documents = mongoose.model("documents", modelSchema);

module.exports = documents;
