const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
    {
 
        requestedBy: {
            type: mongoose.Types.ObjectId,
        },
        deletedBy:{
            type: mongoose.Types.ObjectId,
            default:null
        },
        documentId: {
            type: mongoose.Types.ObjectId,
        },
        isDeleted: {
            type: Boolean,
            default:false
        },
        status : {
            type : Boolean,
            default:false
        },
        seqId: {
            type: Number
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

modelSchema.pre("save", async function (next) {
    const field = this;
    field.seqId = await counterIncrementor("approveddeletedocument");
    next();
});

/**
 * @typedef Fields
 */
const Model = mongoose.model("approveddeletedocument", modelSchema);

module.exports = Model;
