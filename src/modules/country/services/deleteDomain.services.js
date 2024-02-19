const mongoose = require('mongoose');
const Model = require('../domain.model');

const DeleteDomain = async (id) => {
    try {
        // Define a reusable function to deactivate children
        async function deactivateChildren(nodeId) {
            const children = await Model.find({ parentId: nodeId });
            for (const child of children) {
                await deactivateChildren(child._id);
                await Model.findByIdAndUpdate(child._id, { $set: { active: false } });
            }
        }

        const filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) };
        const result = await Model.findOne(filterQuery);


        if (!result) {
            return { data: "Domain Not Found", status: false, code: 400 };
        }

        if (result.parentId == null) {
            // Deactivate children and the current node
            await deactivateChildren(result._id);
            const updatedResult = await Model.findByIdAndUpdate(result._id, { $set: { active: false } });
            return { data: updatedResult, status: true, code: 200 };
        } else {
            // Deactivate children of this node
            const parentIdQuery = { active: true, parentId: mongoose.Types.ObjectId(result._id) };
            const parentIdQueryResult = await Model.find(parentIdQuery);

            if (parentIdQueryResult.length > 0) {
                await Model.updateMany(parentIdQuery, { $set: { active: false } });
            }
            const updatedResult = await Model.findOneAndUpdate(filterQuery, { active: false }, { new: true });
            return { data: updatedResult, status: true, code: 200 };
        }
    } catch (error) {
        console.error("Domain Error",error);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = DeleteDomain;
