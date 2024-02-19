const express = require('express');
const validate = require('../../middlewares/validate');
// const Validation = require('../../modules/logic/validation');
const Controller = require('../../modules/documentnotes/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.route('/:id')
    .get(auth("adminAccess"), Controller.getDocumentNotesByIdController)

router.route('/')
    .post(auth("adminAccess"), Controller.addDocumentNotesController)


module.exports = router;