const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

/**
 * documentnotes schema
 * --------------------
 * A free-text note authored by a user against a specific document.
 *
 * Fields:
 *  - documentId : ObjectId  (required) the document this note belongs to.
 *  - userId     : ObjectId  the author of the note.
 *  - createdBy  : ObjectId  who created the record (reserved; may differ from userId).
 *  - notes      : String    (required) the note body.
 *  - seqId      : Number     human-friendly sequential id (set in pre-save hook).
 *  - active     : Boolean    soft-delete flag, defaults to true.
 *  - timestamps : createdAt / updatedAt added automatically.
 */
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
    seqId: {
      type: Number,
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

/**
 * Pre-save hook: assigns an auto-incrementing `seqId` before the document is
 * first persisted. `counterIncrementor` atomically bumps the shared
 * "documentnotes" counter and returns the next value.
 *
 * NOTE: `seqId` must be declared in the schema (above) for this value to be
 * stored — under Mongoose's default strict mode, undeclared fields are dropped.
 *
 * @param {Function} next - Mongoose middleware callback.
 */
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
