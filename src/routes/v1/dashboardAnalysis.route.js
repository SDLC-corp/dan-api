const express = require('express');
const Controller = require('../../modules/dashboardanalysis/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .get(auth("adminAccess"), Controller.listDocumentCount)

module.exports = router;