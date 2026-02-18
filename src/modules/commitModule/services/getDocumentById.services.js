const mongoose = require('mongoose');
const User = require("../documentNotes.model");

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
        console.log("ERror", error);
        return null
    }
}
module.exports = getDocumentNotesByIdServices