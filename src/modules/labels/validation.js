const Joi = require("joi");
const {
  password,
  emailCustom,
  objectId,
} = require("../../validations/custom.validation");

const addValidation = {
  body: Joi.object().keys({
    label: Joi.string().required().messages({
      "string.empty": `label is required`,
      "any.required": `label is required`,
    }),
    shippingLineId: Joi.custom(objectId).required().messages({
      "string.empty": `shippingLineId is required`,
      "any.required": `shippingLineId is required`,
    }),
    fieldId: Joi.custom(objectId).required().messages({
      "string.empty": `fieldId is required`,
      "any.required": `fieldId is required`,
    }),
    logicCodeId: Joi.custom(objectId).allow("").allow(null).messages({
      "string.empty": `logicCodeId is required`,
      "any.required": `logicCodeId is required`,
    }),
    overrideCustomLogic: Joi.string().allow("").allow(null).messages({
      "string.empty": `overrideCustomLogic is required`,
      "any.required": `overrideCustomLogic is required`,
    }),
    isOverride: Joi.boolean().allow("").allow(null)
  }),
};

const updateValidation = {
  param: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    label: Joi.string().required().messages({
      "string.empty": `label is required`,
      "any.required": `label is required`,
    }),
    logicCodeId: Joi.custom(objectId).allow("").allow(null).messages({
      "string.empty": `logicCodeId is required`,
      "any.required": `logicCodeId is required`,
    }),
    overrideCustomLogic: Joi.string().allow("").allow(null).messages({
      "string.empty": `overrideCustomLogic is required`,
      "any.required": `overrideCustomLogic is required`,
    }),
    isOverride: Joi.boolean().allow("").allow(null),
  }),
};
const listValidation = {
  query: Joi.object().keys({
    limit: Joi.number().allow("", null),
    page: Joi.number().allow("", null),
    search: Joi.object().allow("", null),
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
