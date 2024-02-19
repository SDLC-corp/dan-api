const mongoose = require("mongoose");

const modelSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        disabledModules: [{
            type: String,
        }],
        active: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    },
);


/**
 * @typedef Role
 */
const Role = mongoose.model("role", modelSchema);

module.exports = Role;
