const Joi = require("joi");
const {
    password,
    emailCustom,
    objectId,
} = require("../../validations/custom.validation");

const addValidation = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            "string.empty": `name is required`,
            "any.required": `name is required`,
        }),
        description: Joi.string().required().messages({
            "string.empty": `description is required`,
            "any.required": `description is required`,
        }),
        disabledModules: Joi.array().allow().messages({
            "string.empty": `Disabled Module ids is required`,
            "any.required": `Disabled Module ids is required`,
        }),
    }),
};

const updateValidation = {
    param: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            "string.empty": `name is required`,
            "any.required": `name is required`,
        }),
        description: Joi.string().required().messages({
            "string.empty": `description is required`,
            "any.required": `description is required`,
        }),
        disabledModules: Joi.array().allow().messages({
            "string.empty": `Disabled Module ids is required`,
            "any.required": `Disabled Module ids is required`,
        }),
    }),
};
const listValidation = {
    query: Joi.object().keys({
        limit: Joi.number().allow("", null),
        page: Joi.number().allow("", null),
        all: Joi.boolean().allow("", null),
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
    getSingleValidation
};
