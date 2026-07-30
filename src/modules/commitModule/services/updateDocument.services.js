const mongoose = require('mongoose');
const Model = require("../documentNotes.model")

/**
 * updateDocumentNotes
 * -------------------
 * Edits the body of a single ACTIVE document note.
 *
 * Soft-deleted notes (`active: false`) are deliberately excluded from the
 * filter so a removed note can never be resurrected through an edit.
 *
 * When `userId` is supplied the note must also belong to that user, which keeps
 * one user from editing another user's note. Pass it as `null`/`undefined` to
 * update without the ownership check (e.g. an admin path).
 *
 * Only `notes` is written. Fields that are not declared in the schema are
 * dropped under Mongoose strict mode, so adding audit columns here (updatedBy,
 * etc.) requires declaring them in documentNotes.model.js first.
 *
 * @param {Object} params
 * @param {string} params.id       - The note's ObjectId (as a string).
 * @param {string} params.notes    - The replacement note body.
 * @param {string} [params.userId] - When set, restricts the update to this author.
 * @returns {Promise<Object|null>} The updated note, or `null` when nothing matched.
 */
async function updateDocumentNotes({ id, notes, userId }) {
    let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
    if (userId) filterQuery.userId = mongoose.Types.ObjectId(userId)

    const updated = await Model.findOneAndUpdate(
        filterQuery,
        { notes },
        { new: true }
    )
    return updated
}

module.exports = updateDocumentNotes
