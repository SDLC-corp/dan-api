const express = require('express');
const Controller = require('../../modules/airPortMaster/controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("adminAccess"),  Controller.addPostMaster)
    .get(auth("adminAccess"), Controller.listController)
   
router.route('/list').get(auth("adminAccess"), Controller.portMasterlistWithLimit)
router.route('/syncport').get(auth("adminAccess"), Controller.getSyncPortMaster)

router.route('/:id')
    .post(auth("adminAccess"),  Controller.updateController)
    .get(auth("adminAccess"), Controller.getById)
    .delete(auth("adminAccess"), Controller.deletePortMaster);

module.exports = router;