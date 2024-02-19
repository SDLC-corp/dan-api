const mongoose = require("mongoose");

const modelSchema = mongoose.Schema(
    {
        syncId: {
            type: String,
            required: true
        },
        lastSyncDate:{
            type : Date,
            default: new Date()
        }
    },
    {
        timestamps: true,
    },
);

/**
 * @typedef SyncConfig
 */
const Model = mongoose.model("syncconfig", modelSchema);

module.exports = Model;