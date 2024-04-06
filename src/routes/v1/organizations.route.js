const express = require('express');
const Controller = require('../../modules/organizations/controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const organizationValidation =  require('../../modules/organizations/validation');

const router = express.Router();

router.route('/')
    .get(auth("manageUsers"), Controller.getOrgdById)
    .put(auth("manageUsers"), Controller.updateOrg)

router.post('/professional-account-request', validate(organizationValidation.professionalAccountReq), Controller.proffesionalAccountReq);

module.exports = router;