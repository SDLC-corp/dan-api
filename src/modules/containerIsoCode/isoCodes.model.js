const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
    {
        text: {
            type: String,
        },
        code: {
            type: String,
        },
        description: {
            type: String,
        },
        seqId: {
            type: Number,
        },
        active: {
            type: Boolean,
            default:true
        },
    },
    {
        timestamps: true,
    },
);

modelSchema.pre("save", async function (next) {
    const container_iso_codes = this;
    container_iso_codes.seqId = await counterIncrementor("container_iso_codes");
    console.log('container_iso_codes',container_iso_codes);
    next();
});

/**
 * @typedef PortMaster
 */
const Model = mongoose.model("container_iso_codes", modelSchema);

module.exports = Model;