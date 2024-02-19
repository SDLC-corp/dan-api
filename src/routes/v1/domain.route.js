const express = require('express');
const Controller = require('../../modules/country/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("adminAccess"), Controller.addDomain)
    .get(auth("adminAccess"), Controller.getDomain);

router.route('/deletedomain/:id')
    .put(auth("adminAccess"), Controller.deleteDomainById);

router.route('/:id')
    .put(auth("adminAccess"), Controller.updateDomainById);

module.exports = router;