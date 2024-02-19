const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/user/validation');
const Controller = require('../../modules/user/controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/list')
    .get(auth("adminAccess"), Controller.listControllerWithoutLimit)

router.route('/')
    .get(auth("adminAccess"), Controller.listController)

router.route('/:id')
    .post(auth("adminAccess"), validate(Validation.update), Controller.update)
    .get(auth("adminAccess"), Controller.getSingleUser);

router.route('/update-user-with-pass/:id')
    .post(auth("update-password"), validate(Validation.updateWithPass), Controller.updatePassword)

module.exports = router;