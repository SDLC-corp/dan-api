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
        seqId: {
            type: Number,
        },
        active:{
            type : Boolean,
            default : true
        },
    },
    {
        timestamps: true,
    },
);

modelSchema.pre("save", async function (next) {
    const countrycode = this;
    countrycode.seqId = await counterIncrementor("countrycodes");
    next();
});

/**
 * @typedef countrycodes
 */
const Model = mongoose.model("countrycodes", modelSchema);

module.exports = Model;