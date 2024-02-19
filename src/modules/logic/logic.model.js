const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        shortCode: {
            type: String,
            trim: true,
            required: true,
        },
        textArea: {
            type: String,
            trim: true,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        dependency: {
            type: Array,
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
    const logic = this;
    logic.seqId = await counterIncrementor("logic");
    next();
});

/**
 * @typedef Logic
 */
const Logic = mongoose.model("logic", modelSchema);

module.exports = Logic;
