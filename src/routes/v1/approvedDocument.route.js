const express = require('express');
const validate = require('../../middlewares/validate');
// const Validation = require('../../modules/logic/validation');
const Controller = require('../../modules/approvedtodeletedocument/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.route('/')
    .get(auth("adminAccess"), Controller.listApprovedDocumentController)


router.route('/user')
    .get(auth("adminAccess"), Controller.getDocumentByRequestedId)


module.exports = router;