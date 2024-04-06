const Joi = require("joi");

const professionalAccountReq = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            "string.empty": "name is required",
            "any.required": "name is required",
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "email is required",
            "string.email": "email must be a valid email address",
            "any.required": "email is required",
        }),
        orgName: Joi.string().required().messages({
            "string.empty": "orgName is required",
            "any.required": "orgName is required",
        }),
        phone: Joi.number().required().messages({
            "number.base": "phone number is required and must be a number",
            "any.required": "phone number is required",
        }),
        comment: Joi.string().optional().allow(""),
    }),
};

module.exports = {
    professionalAccountReq,
};
