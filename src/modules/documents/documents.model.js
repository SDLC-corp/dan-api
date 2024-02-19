const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");
const { number, any, object } = require("joi");

const modelSchema = mongoose.Schema(
  {
    domainName: {
      type: String,
      trim: true,
      default: "",
    },
    shippingLineId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
    },
    document: {
      type: String,
      default: "",
    },
    documentUrl: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      default: "",
    },
    orderTypeGid: {
      type: String,
      default: "",
    },
    documentNo: {
      type: String,
      required: true,
    },
    bookingNo: {
      type: String,
      default: "",
    },
    orderType: {
      type: String,
      default: "",
      enum: ["orderBases", "orderReleases", ""],
    },
    stageType: {
      type: String,
      default: "original",
      enum: ["draft", "original"],
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
    syncWithOtm : {
      type: Boolean,
      default: false,
    },
    lastSyncTime: {
      type: Date
    },
    assignTo: {
      type: mongoose.Types.ObjectId,
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
