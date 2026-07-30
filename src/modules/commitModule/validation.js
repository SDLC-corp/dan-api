const Joi = require("joi");
const {
  objectId,
} = require("../../validations/custom.validation");

/**
 * commitModule / document notes validation
 * ----------------------------------------
 * Joi schemas for the document-notes endpoints, shaped for the `validate`
 * middleware (src/middlewares/validate.js).
 *
 * NOTE: the middleware only picks the `params`, `query` and `body` keys off a
 * schema. Several older validation files in this repo declare `param` (no "s"),
 * which means their route-param rules are silently skipped — use `params` here
 * so the id checks actually run.
 */

const addValidation = {
  body: Joi.object().keys({
    notes: Joi.string().required().messages({
      "string.empty": `notes is required`,
      "any.required": `notes is required`,
    }),
    documentId: Joi.custom(objectId).required().messages({
      "string.empty": `documentId is required`,
      "any.required": `documentId is required`,
    }),
  }),
};

const getSingleValidation = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const updateValidation = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    notes: Joi.string().required().messages({
      "string.empty": `notes is required`,
      "any.required": `notes is required`,
    }),
  }),
};

const deleteValidation = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  addValidation,
  getSingleValidation,
  updateValidation,
  deleteValidation,
};
