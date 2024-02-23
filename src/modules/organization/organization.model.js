const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("../../plugins");
const { roles } = require("../../config/roles");
const counterIncrementor = require("../../utils/counterIncrement");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required:true
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    active:{
      type:Boolean,
      default:true
    },
    url:{
      type:String,
      default:""
    }

  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Organization
 */
const Organization = mongoose.model("organization", userSchema);

module.exports = Organization;
