const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

/**
 * deleteDocumentNotesController
 * -----------------------------
 * DELETE handler that soft-deletes a single document note by id.
 * Reads `id` from the route params, delegates to the service layer, and
 * responds 200 with the updated note. When no note matches, a 400 is thrown.
 */
const deleteDocumentNotesController = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  const data = await service.deleteDocumentNotesServices(id);
  if (data) {
    sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Note not found", false, ".")
  }
});

module.exports = deleteDocumentNotesController;
