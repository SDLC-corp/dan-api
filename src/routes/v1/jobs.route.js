const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/OTMJobProcess/validation');
const Controller = require('../../modules/OTMJobProcess/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("adminAccess"), validate(Validation.addJobProcess), Controller.addJobProcess)
    .get(auth("adminAccess"), validate(Validation.listValidation), Controller.getJobList)

//Document Lists without limit
router.route('/list')
    .get(auth("adminAccess"), validate(Validation.listValidation), Controller.getJobListWithOutLimit)

router.route('/:id')
    .get(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.getJobById);

router.route('/document/:id')
    .get(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.getJobByDocumentId);

module.exports = router;