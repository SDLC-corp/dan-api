const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const addDocumentNotesController = catchAsync(async (req, res) => {
  const {
    notes,
    documentId,
  } = await pick(req.body, ["notes", "documentId"]);
  const userId = req.user._id
  const data = await service.addDocumentNotesServices({ notes, documentId, userId })
  if (data) {
    sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not able to add", false, ".")
  }
});

module.exports = addDocumentNotesController;
