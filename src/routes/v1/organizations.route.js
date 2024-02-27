const express = require('express');
const Controller = require('../../modules/organizations/controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .get(auth("manageUsers"), Controller.getOrgdById)



module.exports = router;