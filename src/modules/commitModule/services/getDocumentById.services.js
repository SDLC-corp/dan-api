const mongoose = require('mongoose');
const User = require("../documentNotes.model");

/**
 * getDocumentNotesByIdServices
 * ----------------------------
 * Returns all ACTIVE notes attached to a given document, with each note's
 * author name joined in from the `users` collection.
 *
 * Pipeline:
 *   1. $match   - active notes for `documentId === id`.
 *   2. $lookup  - join `users` on `userId` -> `userdata`.
 *   3. $unwind  - flatten `userdata` (kept even if the user is missing).
 *   4. $project - expose only the fields the UI needs (incl. `userdata.name`).
 *
 * Errors are swallowed and surfaced as `null` so the controller can translate
 * that into a "Note not found" / 400 response.
 *
 * @param {string} id - The document's ObjectId (as a string).
 * @returns {Promise<Array<Object>|null>} Array of note documents, or `null` on error.
 */
const getDocumentNotesByIdServices = async (id) => {
    try {
        let filterQuery = { documentId: mongoose.Types.ObjectId(id), active: true }

        const aggregateQuery = [
            {
                $match: filterQuery,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            {
                $unwind: {
                    path: "$userdata",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    documentId: 1,
                    userId: 1,
                    notes: 1,
                    createdAt: 1,
                    "userdata.name": 1,
                },
            },
        ];
        return await User.aggregate(aggregateQuery)
    } catch (error) {
        return null
    }
}
module.exports = getDocumentNotesByIdServices