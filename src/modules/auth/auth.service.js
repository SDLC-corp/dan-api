const httpStatus = require('http-status');
const tokenService = require('./token.service');
const Token = require('./token.model');
const User = require('../user/user.model');
const Role = require('../role/role.model');
const service = require('./../applicationModules/services')
const ApiError = require('../../utils/ApiError');
const { tokenTypes } = require('../../config/tokens');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { adminRoles } = require('../../config/roles');
const { use } = require('passport');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const signup = async (userBody) => {
	const user = await User.create(userBody);
	return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {

  let user = await User.findOne({ email, active: true }).exec();

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Incorrect email or password', false, false);
  }
    let accessModules = await getAccessModulesFn(user)
    // let accessModules = []
    // if (user?.roleId) {
    //     const roleResult = await Role.findOne({ _id :mongoose.Types.ObjectId(user?.roleId), active:true})
    //     const allModule = await service.moduleList()
    //     let disabledModules = roleResult?.disabledModules || []


    //     accessModules = allModule?.filter(item=> !disabledModules?.includes(item.id))
    //     accessModules = accessModules?.map(item=>item.id)
    // }
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    return {...userWithoutPassword,accessModules}
};


/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};



/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    return tokenService.generateAccessToken(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

//Check email if is already taken
const checkEmail = async (email) => {
  return await User.findOne({ email: email });
};

/**
 * getCurrentUser
 * @param {string} token
 * @returns {Promise}
 */
const getCurrentUser = async (token) => {
  try {
    const { user } = await tokenService.verifyToken(token, 'refresh');
    const userData = await User.findOne({ _id: mongoose.Types.ObjectId(user), active: true });
    let accessModules = await getAccessModulesFn(userData)
    const userDataWithoutPassword = { ...userData._doc };
    delete userDataWithoutPassword.password;
    return { userData:{...userDataWithoutPassword,accessModules}, status: true, statusCode: 200 };
    // return {...userDataWithoutPassword,accessModules}
  } catch (error) {
    // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'getCurrentUser failed');
    return { userData: null, profileData: null, isError: 'getCurrentUser failed', status: false, statusCode: 500 }
  }
};

    async function  getAccessModulesFn(userData) {
        if (userData?.roleId) {
            const roleResult = await Role.findOne({ _id :mongoose.Types.ObjectId(userData.roleId), active:true})
            if (roleResult) {
                const allModule = await service.moduleList()
                let disabledModules = roleResult.disabledModules || []
                /* TODO: remove  */
                accessModules = allModule.filter(item=> !disabledModules.includes(item.id))
                accessModules = accessModules.map(item=>item.id)  
                return accessModules
            }
        }
    }

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  getCurrentUser,
  checkEmail,
  signup
};
