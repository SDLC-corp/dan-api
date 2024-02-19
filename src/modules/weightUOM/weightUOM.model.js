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
    const freightterm = this;
    freightterm.seqId = await counterIncrementor("weightuom");
    next();
});

/**
 * @typedef weightuom
 */
const Model = mongoose.model("weightuom", modelSchema);

module.exports = Model;