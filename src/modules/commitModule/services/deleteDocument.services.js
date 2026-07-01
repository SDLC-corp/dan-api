const Model = require("../documentNotes.model")

/**
 * deleteDocumentNotes
 * -------------------
 * Soft-deletes a document note by flipping its `active` flag to `false`.
 * The record is intentionally kept in the collection for audit/history;
 * read queries that filter on `active: true` (e.g. getDocumentNotesByIdServices)
 * will simply stop returning it.
 *
 * @param {string} id - The note's ObjectId (as a string).
 * @returns {Promise<Object|null>} The updated note document, or `null` if no
 *                                 matching note exists.
 */
async function deleteDocumentNotes(id) {
    const updated = await Model.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
    )
    return updated
}

module.exports = deleteDocumentNotes
