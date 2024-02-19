const Joi = require("joi");
const {
  objectId,
} = require("../../validations/custom.validation");


const listValidation = {
  query: Joi.object().keys({
    limit: Joi.number().allow("", null),
    page: Joi.number().allow("", null),
    search: Joi.string().allow("", null),
    fromDate: Joi.string().allow("", null),
    toDate: Joi.string().allow("", null),
  }),
};

const getSingleValidation = {
  param: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const addJobProcess = {
  body: Joi.object().keys({
    documentId: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  listValidation,
  addJobProcess,
  getSingleValidation
};
