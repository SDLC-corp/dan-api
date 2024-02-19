const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        nodeId: {
            type: Number,
            required: true,
        },
        parentId: {
            type: Number,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        id: {
            type: String,
            default: true,
        },
        group: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    },
);


/**
 * @typedef Modules
 */
const Modules = mongoose.model("modules", modelSchema);

module.exports = Modules;
