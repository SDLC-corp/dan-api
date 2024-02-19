const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/fieldGroup/validation');
const Controller = require('../../modules/fieldGroup/controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("manageFields"), validate(Validation.addValidation), Controller.addFieldGroupController)
    // .get(auth("manageFields"), Controller.getFieldGroupById)

router
    .get("/ddlist",auth("adminAccess"), Controller.listFieldGroupController)
    .get("/list",auth("adminAccess"), Controller.listFieldGroup)

router.route('/:id')
    .post(auth("manageFields"), validate(Validation.updateValidation), Controller.updateFieldGroup)
    .get(auth("manageFields"), validate(Validation.getSingleValidation), Controller.getFieldGroupById)
    .put(auth("manageFields"), validate(Validation.getSingleValidation), Controller.deleteFieldGroup)

module.exports = router;