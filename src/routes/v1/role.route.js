const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/role/validation');
const Controller = require('../../modules/role/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("adminAccess"), validate(Validation.addValidation), Controller.addRoleController)
    .get(auth("adminAccess"), validate(Validation.listValidation), Controller.listRoleController)

router.route('/all')
    .get(auth("adminAccess"), Controller.listRoleWithoutLimitController)

router.route('/:id')
    .post(auth("adminAccess"), validate(Validation.updateValidation), Controller.updateRoleController)
    .get(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.getRoleController)
    .put(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.deleteRoleController)

module.exports = router;