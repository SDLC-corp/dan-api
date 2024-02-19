const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/documents/validation');
const Controller = require('../../modules/documents/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route("/extract").get(Controller.extractFields)

router.route("/update-field/:documentId").post(validate(Validation.updateFieldValidation), Controller.updateFields)
router.route("/delete-field/:documentId").post(validate(Validation.deleteFieldValidation), Controller.deleteFields)
router.route("/processExtractedFields/:documentId").post(auth("adminAccess"),validate(Validation.processExtractedFields), Controller.processExtractedFields)

//Document Lists without limit
router.route('/list')
    .get(auth("adminAccess"), validate(Validation.listValidation), Controller.documentListWithoutLimit)

router.route('/update-assign-to-user/:id')
    .post(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.updateAssignToUserId
)
router.route('/allow-sync/:id')
    .post(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.allowSync)

router.route('/:id')
    .get(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.documentById)
    .post(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.updateDocument)
    .put(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.deleteDocumentById);

router.route('/deletebymail/:id')
    .get(auth("adminAccess"), validate(Validation.getSingleValidation), Controller.deleteDocumentByMail);

router.route('/')
    .post(auth("adminAccess"), validate(Validation.addValidation), Controller.addDocument)
    .get(auth("adminAccess"), validate(Validation.listValidation), Controller.documentList)




router.route("/check/orderBases").get(Controller.checkOTMOrderBases);


module.exports = router;