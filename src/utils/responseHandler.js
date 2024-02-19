function sendResponse(res, status, data, err = null) {
  if (err) {
    res.status(status).json({
      code:status,
      status: status > 199 && status < 299 ?true:false,
      data: err,
    });
  } else {
    res.status(status).json({
      code:status,
      status: status > 199 && status < 299 ?true:false,
      data,
    });
  }
}

module.exports.sendResponse = sendResponse;
