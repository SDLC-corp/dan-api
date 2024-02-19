const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/shippingLine/validation');
const Controller = require('../../modules/shippingLine/controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("manageUsers"), validate(Validation.addValidation), Controller.addController)
    .get(auth("adminAccess"), validate(Validation.listValidation), Controller.listController)
//shippingLine without limit
router.route('/list')
    .get(auth("adminAccess"), validate(Validation.listValidation), Controller.shippingLineListWithoutLimit)

router.route('/allextraction/:id')
    .post(auth("adminAccess"), validate(Validation.extractAllValidation), Controller.extractAllShippingLine)


router.route('/:id')
    .post(auth("manageUsers"), validate(Validation.updateValidation), Controller.updateController)
    .get(auth("manageUsers"), validate(Validation.getSingleValidation), Controller.getById)
    .put(auth("manageUsers"), validate(Validation.getSingleValidation), Controller.deleteShippingLine);

module.exports = router;