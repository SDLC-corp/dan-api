const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/fields/validation');
const Controller = require('../../modules/fields/controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("manageFields"), validate(Validation.addValidation), Controller.addFieldController)
    .get(auth("manageFields"), validate(Validation.listValidation), Controller.listFieldsController)

router.route('/:id')
    .get(auth("manageFields"), validate(Validation.getSingleValidation), Controller.getByIdController)
    .post(auth("manageFields"), validate(Validation.updateValidation), Controller.updateFieldsController)
    .put(auth("manageFields"), validate(Validation.getSingleValidation), Controller.deleteFieldsController)

module.exports = router;