const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const authService = require('./auth.service');
const tokenService = require('./token.service')
const { sendResponse } = require('../../utils/responseHandler');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const config = require('../../config/config');

const register = catchAsync(async (req, res) => {
  const { orgId } = pick(req.user._doc, ["orgId"])
  console.log(orgId);
  const {
    email,
    password,
    name,
    phone,
    profilePic,
    role,
    roleId
  } = pick(req.body, [
    "email",
    "password",
    "name",
    "phone",
    "profilePic",
    "role",
    "roleId"
  ]);



  const isEmailTaken = await authService.checkEmail(email)
  if (isEmailTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Already taken")
  }

  const userObj = {
    email,
    password,
    name,
    phone,
    roleId,
    profilePic,
    role,
    orgId
  }

  const user = await authService.signup(userObj);
  if (user) {
    const tokens = await tokenService.generateAuthTokens(user);
    sendResponse(res, httpStatus.CREATED, { user, tokens }, null)
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "User was not registered", false, false)
  }

});



const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);

  if (!user) {
    return sendResponse(res, httpStatus.FORBIDDEN, null, "Something went wrong, try again");
  }
  const tokens = await tokenService.generateAuthTokens(user);
  sendResponse(res, httpStatus.OK, { user: user, tokens }, null);
});



const getCurrentUser = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;
    const userRes = await authService.getCurrentUser(token);
    if (userRes.status) {
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: true,
        data: { userData: userRes.userData, profileData: userRes.profileData }
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        status: false,
        data: 'something went wrong',
      });
    }
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: err.message,
    });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(200).send(tokens);
});


const addRegistrationProcess = catchAsync(async (req, res) => {

  const { name, website, orgName, email, phone } = await pick(req.body, ['name', 'website', 'orgName', 'email','phone']);

  const result = await authService.addRegistrationProcess({ name, website, orgName, email, phone });

  sendResponse(res, httpStatus.OK, result, null);

});



const verifyRegistration = catchAsync(async (req, res) => {

  const { token, otp } = await pick(req.body, ['token', 'otp']);

  const result = await authService.verifyRegistration({ token, otp });
  sendResponse(res, httpStatus.OK, result, null);

});

const registration = catchAsync(async (req, res) => {
  const { token, password } = await pick(req.body, ["token", "password"]);
  const result = await authService.registration({ token, password });
  sendResponse(res, httpStatus.OK, result, null);
});


module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  getCurrentUser,
  addRegistrationProcess,
  verifyRegistration,
  registration
};
