const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../../plugins');
const { roles } = require('../../config/roles');
const counterIncrementor = require('../../utils/counterIncrement');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    profilePic: {
      type: String,
      default: "/default.png",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      required: true,
      default: 'admin',

    },
    roleId: {
      type: mongoose.Types.ObjectId,
      required:true,
    },
    orgId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    seqId: {
      type: Number
    },
    active: {
      type: Boolean,
      default: true
    },
    inActive: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('findOneAndUpdate', async function (next) {
  // console.log("update hook fired")
  const user = this;
  if (user._update && user._update.password) {
    user._update.password = await bcrypt.hash(user._update.password, 8);
  }
  next();
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (user.role) {
    user.seqId = await counterIncrementor('user')
  } else {
    user.seqId = await counterIncrementor(user.role)
  }
  // console.log("user schema checking password value", user.password)
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('users', userSchema);

module.exports = User;
