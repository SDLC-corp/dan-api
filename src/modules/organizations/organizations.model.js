const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const organizationsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    website: {
      type: String,
      trim: true,
      required: true,
    },
    syncApiUrl: {
      type: String,
      trim: true
    },
    isFreeAccount:{
      type:Boolean,
      default:true,
    },
    documentUploadedCount:{
      type: Number,
      default: 0,
    },
    seqId: {
      type: Number
    },
    active: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Organization
 */
organizationsSchema.pre("save", async function (next) {
  const doc = this;
  doc.seqId = await counterIncrementor("organization");
  next();
});

const Organization = mongoose.model("organization", organizationsSchema);

module.exports = Organization;
