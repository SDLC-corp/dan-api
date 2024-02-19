const Joi = require("joi");
const {
    objectId,
} = require("../../validations/custom.validation");

const addValidation = {
    body: Joi.object().keys({
        requestedTo: Joi.custom(objectId),
        requestedBy: Joi.custom(objectId),
        documentId: Joi.custom(objectId),
        approved: Joi.boolean(),
    }),
};


module.exports = {
    addValidation,
};
