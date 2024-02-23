const Joi = require('joi');
const { password,emailCustom,objectId } = require('../../validations/custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    name: Joi.string().required().messages({
      "string.empty": `First name must contain value`,
      "any.required": `First name is a required field`
    }),
    profilePic: Joi.string().allow(''),
    roleId: Joi.string().allow(''),
  }),
};

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    name: Joi.string().required().messages({
      "string.empty": `First name must contain value`,
      "any.required": `First name is a required field`
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(emailCustom).messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`
    }),
  }),
};

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    
  }),
};

const resetPasswordValidation = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const socialLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const addRegistrationProcessValidation = {
  body: Joi.object().keys({

      name: Joi.string().required().messages({
          "string.empty": `First name must contain value`,
          "any.required": `First name is a required field`
      }),
      email: Joi.string().required().email().messages({
          "string.empty": `Email must contain value`,
          "any.required": `Email is a required field`,
          "string.email": `Email must be valid mail`,
      }),
      orgName: Joi.string().required().messages({
          "string.empty": `Organization Name must contain value`,
          "any.required": `Organization Name is a required field`
      }),
      website: Joi.alternatives().try(
          Joi.string().uri({ scheme: ['http', 'https'] }),
          Joi.string().pattern(new RegExp('^(?:www\\.)?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}$'))
      ).required().messages({
          "string.empty": `Website must contain value`,
          "any.required": `Website is a required field`,
          "string.uri": `Website must be a valid URI`,
          "alternatives.types": `Website must be a valid URL or a valid hostname`,
      }),
  }),
};

const verifyRegistration = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    otp: Joi.number().required()
  }),
};


const getRegistrationProcessValidation = {
  param: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const registrationValidation = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
  }),
};


module.exports = {
  register,
  login,
  logout,
  resetPasswordValidation,
  adminLogin,
  socialLogin,
  signup,
  addRegistrationProcessValidation,
  verifyRegistration,
  getRegistrationProcessValidation,
  registrationValidation
};
