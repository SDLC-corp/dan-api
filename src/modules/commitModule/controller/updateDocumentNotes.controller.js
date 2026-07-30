const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

/**
 * updateDocumentNotesController
 * -----------------------------
 * PUT handler that edits the body of a single document note.
 *
 * Reads `id` from the route params and `notes` from the body, then delegates to
 * the service layer scoped to the requesting user so a note can only be edited
 * by its author. Responds 200 with the updated note; a 400 is thrown when no
 * active note matches the id for this user.
 */
const updateDocumentNotesController = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  const { notes } = await pick(req.body, ["notes"]);
  const userId = req.user._id
  const data = await service.updateDocumentNotesServices({ id, notes, userId });
  if (data) {
    sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Note not found", false, ".")
  }
});

module.exports = updateDocumentNotesController;
