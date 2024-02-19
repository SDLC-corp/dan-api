const Joi = require("joi");
const {
  password,
  emailCustom,
  objectId,
} = require("../../validations/custom.validation");

const addValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": `Name is required`,
      "any.required": `Name is required`,
    }),
    modelId: Joi.string().required().messages({
      "string.empty": `modelId is required`,
      "any.required": `modelId is required`,
    }),
    code: Joi.string().required().messages({
      "string.empty": `code is required`,
      "any.required": `code is required`,
    }),
    locationName: Joi.string().required().messages({
      "string.empty": `Location Name is required`,
      "any.required": `Location Name is required`,
    }),
    locationId: Joi.string().required().messages({
      "string.empty": `Location Id is required`,
      "any.required": `Location Id is required`,
    }),
    type: Joi.string().required().messages({
      "string.empty": `Type is required`,
      "any.required": `Type is required`,
    }),
    logo: Joi.string().allow(null, ""),
    description: Joi.string().allow(null, ""),
  }),
};

const updateValidation = {
  param: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": `Name is required`,
      "any.required": `Name is required`,
    }),
    modelId: Joi.string().required().messages({
      "string.empty": `modelId is required`,
      "any.required": `modelId is required`,
    }),
    locationName: Joi.string().required().messages({
      "string.empty": `Location Name is required`,
      "any.required": `Location Name is required`,
    }),
    locationId: Joi.string().required().messages({
      "string.empty": `Location Id is required`,
      "any.required": `Location Id is required`,
    }),
    type: Joi.string().required().messages({
      "string.empty": `Type is required`,
      "any.required": `Type is required`,
    }),
    code: Joi.string().allow(null,""),
    logo: Joi.string().allow(null, ""),
    description: Joi.string().allow(null, ""),
  }),
};
const listValidation = {
  query: Joi.object().keys({
    limit: Joi.number().allow("", null),
    page: Joi.number().allow("", null),
    search: Joi.string().allow("", null),
    type: Joi.string().allow("", null),
  }),
};
const extractAllValidation = {
  body: Joi.object().keys({
    option: Joi.string().required().messages({
      "string.empty": `Option is required`,
    }),
  })
};
const getSingleValidation = {
  param: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};
module.exports = {
  addValidation,
  listValidation,
  updateValidation,
  getSingleValidation,
};
