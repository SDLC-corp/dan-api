const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
    {
        locationGid: {
            type: String,
        },
        locationXid: {
            type: String,
        },
        locationName: {
            type: String,
        },
        seqId: {
            type: Number,
        },
        active:{
            type : Boolean,
            default : true
        },
        fromOTM:{
            type : Boolean,
            default : false
        },
        lastSyncDate:{
            type : Date,
        }
    },
    {
        timestamps: true,
    },
);

modelSchema.pre("save", async function (next) {
    const port_master = this;
    port_master.seqId = await counterIncrementor("port_masters");
    next();
});

/**
 * @typedef PortMaster
 */
const Model = mongoose.model("port_masters", modelSchema);

module.exports = Model;