const express = require('express');
const validate = require('../../middlewares/validate');
const Controller = require('../../modules/applicationModules/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .get(auth("adminAccess"), Controller.moduleListController)

module.exports = router;