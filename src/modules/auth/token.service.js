const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../config/config');
const Token  = require('./token.model');
const { tokenTypes } = require('../../config/tokens');
const { User } = require('../user/user.model');
const userService = require('../user/services');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};


/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  try {
    await Token.updateMany({ type, user: userId, blacklisted: false }, {$set: {blacklisted: true}});
  } catch (error) {
  }
  
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  // console.log("expiry :--",config.jwt.accessExpirationMinutes, config.jwt.refreshExpirationMinutes);
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user._id, accessTokenExpires, tokenTypes.ACCESS);
  
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationMinutes, 'days');
  // console.log("access expiry :--", accessTokenExpires);
  // console.log("refresh expiry :--", refreshTokenExpires);
  const refreshToken = generateToken(user._id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user._id, refreshTokenExpires, tokenTypes.REFRESH,false);
  return {  
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateAccessToken = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user._id, accessTokenExpires, tokenTypes.ACCESS);
  return {
    accessToken
  }
};
const generateAccessTokens = async (userId) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(userId, accessTokenExpires, tokenTypes.ACCESS);

  let user = userService.getUserById(userId)
  return {
    accessToken,
    user
  }
};
/**
 * Generate reset password token
 * @param {object} id
 * @returns {Promise<Object>}
 */
 const generateResetPasswordToken = async (id) => {
  // console.log("1" ,id);
  const user = await  User.findById(id);
  if (!user) {
    return { error: "No users found" }
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return { user, resetPasswordToken };
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAccessToken,
  generateAuthTokens,
  generateAccessTokens,
  generateResetPasswordToken,
};
