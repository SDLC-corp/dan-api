const Joi = require("joi");
const {
  password,
  emailCustom,
  objectId,
} = require("../../validations/custom.validation");

const addValidation = {
  body: Joi.object().keys({
    paramName: Joi.string().required().messages({
      "string.empty": `Param Name is required`,
      "any.required": `Param Name is required`,
    }),
    displayName: Joi.string().required().messages({
      "string.empty": `Display Name is required`,
      "any.required": `Display Name is required`,
    }),
    regx: Joi.string().allow("").messages({
      "string.empty": `Regx is required`,
      "any.required": `Regx is required`,
    }),
    fieldTableValue: Joi.array().allow().messages({
      "string.empty": `Field Table Value is required`,
      "any.required": `Field Table Value is required`,
    }),
    master: Joi.object().allow().messages({
      "string.empty": `master is required`,
      "any.required": `master is required`,
    }),
    dateFormat: Joi.string().allow("").messages({
      "string.empty": `Date Format is required`,
      "any.required": `Date Format is required`,
    }),
    fieldType: Joi.string().allow("").messages({
      "string.empty": `Field Type is required`,
      "any.required": `Field Type is required`,
    }),
    fieldTextValue: Joi.string().allow("").messages({
      "string.empty": `Field Text Value is required`,
      "any.required": `Field Text Value is required`,
    }),
    fieldNumValue: Joi.string().allow("").messages({
      "string.empty": `Field Num Value is required`,
      "any.required": `Field Num Value is required`,
    }),
    fieldGroupId: Joi.custom(objectId).allow(""),
  }),
};

const updateValidation = {
  param: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    paramName: Joi.string().required().messages({
      "string.empty": `Param Name is required`,
      "any.required": `Param Name is required`,
    }),
    displayName: Joi.string().required().messages({
      "string.empty": `Display Name is required`,
      "any.required": `Display Name is required`,
    }),
    regx: Joi.string().allow("").messages({
      "string.empty": `Regx is required`,
      "any.required": `Regx is required`,
    }),
    fieldTableValue: Joi.array().allow().messages({
      "string.empty": `Field Table Value is required`,
      "any.required": `Field Table Value is required`,
    }),
    master: Joi.object().allow().messages({
      "string.empty": `master is required`,
      "any.required": `master is required`,
    }),
    dateFormat: Joi.string().allow("").messages({
      "string.empty": `Date Format is required`,
      "any.required": `Date Format is required`,
    }),
    fieldType: Joi.string().allow("").messages({
      "string.empty": `Field Type is required`,
      "any.required": `Field Type is required`,
    }),
    fieldTextValue: Joi.string().allow("").messages({
      "string.empty": `Field Text Value is required`,
      "any.required": `Field Text Value is required`,
    }),
    fieldNumValue: Joi.string().allow("").messages({
      "string.empty": `Field Num Value is required`,
      "any.required": `Field Num Value is required`,
    }),
    index: Joi.number().messages({
      "string.empty": `index is required`,
      "any.required": `index is required`,
    }),
    fieldGroupId: Joi.string().allow(""),
  }),
};
const listValidation = {
  query: Joi.object().keys({
    limit: Joi.number().allow("", null),
    page: Joi.number().allow("", null),
    search: Joi.string().allow("", null),
  }),
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
