const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const seriesServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getDocumentAnalytics = catchAsync(async (req, res) => {

	
	let { fromDate , toDate,domainName,shippingLine  } = await pick(req.query, ['fromDate', 'toDate','domainName',"shippingLine"])
  let filter = { active: true, }
	/* set hours */
	if (fromDate && toDate) {
		filter['createdAt'] = {
			'$gte': new Date(new Date(fromDate).setHours(0,0, 0,0)),
			'$lte': new Date(new Date(toDate).setHours(23, 59, 59))
		}
	}
    const domainArray = domainName ? JSON.parse(domainName):[]
    const shippingLineArray = shippingLine ? JSON.parse(shippingLine):[]
    const list = await seriesServices.listDocumentCount(req.user, fromDate && toDate && (fromDate != undefined && toDate != undefined) ? filter : null,domainName=domainArray,shippingLine=shippingLineArray);
    if (list.status) {
      sendResponse(res, httpStatus.OK, list, null);
    } else {
      if(list.code == 400){
        sendResponse(res,httpStatus.BAD_REQUEST,null,list);
      }else if(list.code == 500){
        sendResponse(res,httpStatus.INTERNAL_SERVER_ERROR,null,list);
      }else{
        sendResponse(res,httpStatus.BAD_REQUEST,null,list);
      }
    }
});

module.exports = getDocumentAnalytics
