const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const { checkDocumentAndOrderTypeInOTM } = require("../../../utils/otmApiHelper");

const checkOTMOrderBases = catchAsync(async (req, res) => {
  const { domainName, documentNo, bookingNo,type } = await pick(req.query, ["domainName", "documentNo", "bookingNo","type"]);

  let { orderTypeGid, orderType, orderReleasesExisted } = await checkDocumentAndOrderTypeInOTM({
    domainName, documentNo, bookingNo,type
  });

    if (type === "air") {
        if (!orderReleasesExisted) {
            sendResponse(res, httpStatus.OK, { docPresent: false, orderReleasesExisted: false, count: 0 }, null);
            return
        }
    } else {
        if (orderReleasesExisted) {
            sendResponse(res, httpStatus.OK, { docPresent: false, orderReleasesExisted: true, count: 0 }, null);
            return
        }
    }

  if(orderType){
    sendResponse(res, httpStatus.OK, {docPresent: true, count: 1}, null);
  } else {
    sendResponse(res, httpStatus.OK, {docPresent: false, count: 0}, null);

  }
  
});
module.exports = checkOTMOrderBases;
