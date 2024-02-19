const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");
const { object } = require("joi");

const modelSchema = mongoose.Schema(
  {
    paramName: {
      type: String,
      trim: true,
      required: true,
    },
    displayName: {
      type: String,
      trim: true,
      required: true,
    },
    seqId: {
      type: Number,
    },
    regx: {
      type: String,
    },
    fieldTextValue: {
      type: String,
    },
    fieldNumValue: {
      type: String,
    },
    fieldType: {
      type: String,
    },
    fieldTableValue: {
      type: Array,
    },
    index: {
      type: Number,
    },
    master: {
      type: Object,
    },
    dateFormat:{
      type: String,
    },
    fieldGroupId:{
      type: mongoose.Types.ObjectId,
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
  const field = this;
  field.seqId = await counterIncrementor("field");
  next();
});

/**
 * @typedef Fields
 */
const Model = mongoose.model("fields", modelSchema);

module.exports = Model;
