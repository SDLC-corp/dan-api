const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/commitModule/validation');
const Controller = require('../../modules/commitModule/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(auth("adminAccess"), validate(Validation.addValidation), Controller.addDocumentNotesController);

router.route('/:id')
    .get(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.getDocumentNotesByIdController)
    .put(auth("adminAccess"), validate(Validation.updateValidation), Controller.updateDocumentNotesController)
    .delete(auth("adminAccess"), validate(Validation.deleteValidation), Controller.deleteDocumentNotesController);

module.exports = router;