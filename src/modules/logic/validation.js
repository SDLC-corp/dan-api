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
        shortCode: Joi.string().required().messages({
            "string.empty": `shortCode is required`,
            "any.required": `shortCode is required`,
        }),
        textArea: Joi.string().required().messages({
            "string.empty": `textArea is required`,
            "any.required": `textArea is required`,
        }),
        dependency: Joi.array().allow().messages({
            "string.empty": `Dependency is required`,
            "any.required": `Dependency is required`,
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
        shortCode: Joi.string().required().messages({
            "string.empty": `shortCode is required`,
            "any.required": `shortCode is required`,
        }),
        textArea: Joi.string().required().messages({
            "string.empty": `textArea is required`,
            "any.required": `textArea is required`,
        }),
        dependency: Joi.array().allow().messages({
            "string.empty": `Dependency is required`,
            "any.required": `Dependency is required`,
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
