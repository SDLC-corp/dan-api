const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/labels/validation');
const Controller = require('../../modules/labels/controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("manageUsers"), validate(Validation.addValidation), Controller.addLabelController)
    .get(auth("manageUsers"), validate(Validation.listValidation), Controller.listLabelsController)

router.route('/matrix')
    .get(auth("manageUsers"), Controller.generateMatrix);

router.route('/:id')
    .get(auth("manageUsers"), validate(Validation.getSingleValidation), Controller.getByIdController)
    .post(auth("manageUsers"), validate(Validation.updateValidation), Controller.updateLabelsController)
    .delete(auth("manageUsers"), validate(Validation.getSingleValidation), Controller.deleteLabelsController)

module.exports = router;