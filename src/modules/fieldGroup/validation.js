const Joi = require("joi");
const {
  password,
  emailCustom,
  objectId,
} = require("../../validations/custom.validation");

const addValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": `Group Name is required`,
      "any.required": `Group Name is required`,
    }),
    description: Joi.string().allow("").messages({
      "string.empty": `Description is required`,
      "any.required": `Description is required`,
    }),
    layout: Joi.string().messages({
      "string.empty": `Layout is required`,
      "any.required": `Layout is required`,
    }),
  }),
};

const updateValidation = {
  param: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
   body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": `Group Name is required`,
      "any.required": `Group Name is required`,
    }),
    description: Joi.string().allow("").messages({
      "string.empty": `Description is required`,
      "any.required": `Description is required`,
    }),
    layout: Joi.string().messages({
      "string.empty": `Layout is required`,
      "any.required": `Layout is required`,
    }),
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
