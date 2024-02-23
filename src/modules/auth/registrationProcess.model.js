const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const registrationProcessSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        orgName: {
            type: String,
            trim: true,
            required: true,
        },
        website: {
            type: String,
            trim: true,
            required: true,
        },
        otp: {
            type: Number,
            trim: true,
            required: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        processCompleted: {
            type: Boolean,
            default: false,
        },
        seqId: {
            type: Number
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
    }
);

/**
 * @typedef RegistrationProcess
 */
registrationProcessSchema.pre("save", async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor("registration_process");
    next();
});

const RegistrationProcess = mongoose.model("registration_process", registrationProcessSchema);

module.exports = RegistrationProcess;
