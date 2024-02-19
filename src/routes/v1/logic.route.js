const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/logic/validation');
const Controller = require('../../modules/logic/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("manageUsers"), validate(Validation.addValidation), Controller.addLogicController)
    .get(auth("manageUsers"), validate(Validation.listValidation), Controller.listLogicController)


router.route('/:id')
    .post(auth("manageUsers"), validate(Validation.updateValidation), Controller.updateLogicController)
    .get(auth("manageUsers"), validate(Validation.getSingleValidation), Controller.getLogicController)
    .put(auth("manageUsers"), validate(Validation.getSingleValidation), Controller.deleteLogicController)

module.exports = router;