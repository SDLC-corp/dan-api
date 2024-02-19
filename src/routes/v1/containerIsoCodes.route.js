const express = require('express');
const Controller = require('../../modules/containerIsoCode/controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("adminAccess"),  Controller.addIsoCodes)
    .get(auth("adminAccess"), Controller.listController)
router
    .get("/list",auth("adminAccess"), Controller.isoCodelistWithLimit)
    .get("/ddlist",auth("adminAccess"), Controller.listController)
   

router.route('/:id')
    .get(auth("adminAccess"), Controller.getByIdIsoCodes)
    .post(auth("adminAccess"),  Controller.updateIsoCodes)
    .delete(auth("adminAccess"),  Controller.deleteIsoCode)

module.exports = router